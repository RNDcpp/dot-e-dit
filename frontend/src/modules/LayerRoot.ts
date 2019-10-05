import Layer, { Commitable, Base, LayerHistory } from  './Layer'
import PixcelMap from './PixcelMap'
import { MIX_TYPE } from './MixType'

export default class LayerRoot implements Commitable{
  id: 0
  private static _instance: LayerRoot 
  base: Layer | Base // 子から参照されるのでpublic
  private pixcelMap: PixcelMap
  private previewMap: PixcelMap
  static get instance() {
    if(!this._instance) {
      this._instance = new LayerRoot()
    }
    return this._instance
  }
  private constructor(){
    this.id = 0
    this.base = new Base(this)
    this.pixcelMap = this.base.pixcelMap 
    this.previewMap = this.pixcelMap
  }
  info = () => {
    return LayerHistory.log
  }
  add = () =>{
    let base = this.base
    let layer = new Layer(this,this.base,MIX_TYPE.PLANE)
    LayerHistory.send('add(Root)', layer.id)
    this.base = layer
    base.parent = layer
    this.commit()
  }
  plot = () => this.pixcelMap
  genCode = () => { this.pixcelMap.getCode(); this.previewMap.getCode() }
  commit = () => { this.pixcelMap = this.base.pixcelMap; this.pixcelMap.getCode(); LayerHistory.send('commit(Root)', this.id) }
  view = (pixcelMap: PixcelMap) => { this.previewMap = pixcelMap; this.previewMap.getCode() }
  update = () => {}
  apply = (pixcelMap: PixcelMap) => pixcelMap
}