import PixcelMap, { PixcelMapBase } from './PixcelMap'
import { MIX_TYPE } from './MixType'
import LayerRoot from './LayerRoot'
import ApplicationError from './Error'

export interface Commitable {
  update(pixcelMap: PixcelMap): void
  apply(pixcelMap: PixcelMap): PixcelMap
  commit(): void
  view(pixcelMap: PixcelMap, source: Layer): void
}

interface Log {
  id: number
  command: string
}
export class LayerHistory {
  private static _log: Array<Log> = []
  public static send(command: string, id:number){
    this._log.push({id, command})
  }
  static get log(){return this._log}
}

export class Base {
  id: number = -1
  parent: Layer | LayerRoot
  get pixcelMap(){return  PixcelMapBase.planePixcelMap}
  constructor(parent: Layer | LayerRoot){
    this.parent = parent
  }
  remove(){delete(this.parent)}
}

export class LayerIndex {
  private static _maxId: number = 0
  private static _managed: {
    [key: number]:Layer
  } = {}
  static getId(){ this._maxId += 1; return this._maxId}
  static connect(layer: Layer){ this._managed[layer.id] = layer }
  static release(id: number){ delete this._managed[id] }
  static select(id: number) {return this._managed[id]}
  static get index() {return Object.keys(this._managed)}
}

export class WorkSpace {
  pixcelMap: PixcelMap
  id: number = -2
  private static _instance: WorkSpace
  public static get instance(){
    if(!this._instance){
      this._instance = new WorkSpace
    }
    return this._instance
  }
  private constructor() {
    this.pixcelMap = PixcelMapBase.createPixcelMap()
  }
}

export default class Layer implements Commitable{
  id: number
  parent: Layer | LayerRoot
  base: Layer | Base
  cliped: Layer | Base
  workspace: WorkSpace

  pixcelMap: PixcelMap
  _unmergedPixcelMap: PixcelMap
  type: MIX_TYPE

  getPixcelMap = () => this.pixcelMap

  constructor(parent: Layer | LayerRoot, base: Layer | Base, type: MIX_TYPE) {
    this.id = LayerIndex.getId()
    LayerIndex.connect(this)
    this._unmergedPixcelMap = PixcelMapBase.createPixcelMap()
    this.pixcelMap = this._unmergedPixcelMap
    this.parent = parent
    this.base = base
    this.cliped = new Base(this)
    this.workspace = WorkSpace.instance
    this.type = type
  }

  add() {
    let layer = new Layer(this, this.base, MIX_TYPE.PLANE)
    LayerHistory.send('add', layer.id)
    let base = this.base
    base.parent = layer
    this.base = layer
    this.commit()
  }
  insert(layer: Layer) {
    LayerHistory.send('insert', layer.id)
    let base = this.base
  
    base.parent = layer
    layer.base = base

    layer.parent = this
    this.base = layer
    this.commit()
  }
  clip(layer: Layer) {
    LayerHistory.send('clip', layer.id)
    let cliped = this.cliped

    cliped.parent = layer
    layer.base = cliped

    layer.parent = this
    this.cliped = layer
    this.commit()
  }
  remove() {
    let parent = this.parent
    delete(this.parent)
    let cliped = this.cliped
    delete(this.cliped)
    let base = this.base
    delete(this.base)
    LayerIndex.release(this.id)

    cliped.remove()
  
    base.parent = parent
    parent.base = base
    parent.commit()
  }

  /** clipedのレイヤーをマスクしてbaseレイヤーに重ねたものを出力する */
  superpose = (base: PixcelMap, cliped: PixcelMap) => cliped
                                                  .superpose(this._unmergedPixcelMap, MIX_TYPE.PLANE, true)
                                                  .superpose(base, this.type, false)
  
  /**  */
  commit = () => { 
    this.pixcelMap = this.superpose(this.base.pixcelMap, this.cliped.pixcelMap)
    LayerHistory.send('commit', this.id)
    this.parent.commit()
  }

  apply = (pixcelMap: PixcelMap) => pixcelMap.superpose(this.pixcelMap, MIX_TYPE.PLANE, false)

  update = (pixcelMap: PixcelMap) => {
    LayerHistory.send('update', this.id)
    this._unmergedPixcelMap = pixcelMap
    this.commit()
  }

  view = (pixcelMap: PixcelMap, source: Layer | WorkSpace) => {
    if(source === this.base){
      this.parent.view(this.superpose(pixcelMap, this.cliped.pixcelMap), this)
    }else if(source === this.cliped){
      this.parent.view(this.superpose(this.base.pixcelMap, pixcelMap), this)
    }else if(source === this.workspace){
      this.parent.view(
        pixcelMap.superpose(this._unmergedPixcelMap, MIX_TYPE.PLANE, false)
                 .superpose(this.cliped.pixcelMap, MIX_TYPE.PLANE, true)
                 .superpose(this.base.pixcelMap, this.type, false)
        ,this
      )
    }else{
      throw new ApplicationError('invalid source view')
    }
  }

  private nullSafe(){
    if(this.base === null || this.cliped === null || this.parent === null){
      throw new ApplicationError('null') 
    }
  }
}