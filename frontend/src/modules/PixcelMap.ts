import Pixcel, { implementsPixcel }  from './Pixcel'
import { MIX_TYPE } from './MixType'
import Color from './Color'

export class PixcelMapBase{
  private static _w: number = 9
  private static _h: number = 9
  private static _planeMap: PixcelMap
  private static _managed: Array<PixcelMap>
  private constructor() {}
  static get w(){return this._w}
  static get h(){return this._w}
  static get planePixcelMap(){
    if(!this._planeMap){
      this._planeMap = new PixcelMap(new Color(255,255,255,0), this._w, this._h)
    }
    return this._planeMap
  }
  static createPixcelMap(){
    let pixcelMap = new PixcelMap(new Color(255,255,255,0), this._w, this._h)
    this.connect(pixcelMap)
    return pixcelMap
  }
  static createPixcelMapWhite(){
    let pixcelMap = new PixcelMap(new Color(255,255,255,1), this._w, this._h)
    this.connect(pixcelMap)
    return pixcelMap
  }
  public static connect(pix: PixcelMap){
    this._managed
  }
  public static release(pix: PixcelMap){
    this._managed = this._managed.filter((p) => p !== pix)
  }
  public static update(w: number, h: number){
    this._w = w
    this._h = h
    this._planeMap.update(w,h)
    this._managed.forEach((pix) => {pix.update(w,h)})
  }
}

export default class PixcelMap{
  value: Array<Array<Pixcel>>
  private _viewPosX: number
  private _viewPosY: number
  private _viewPosW: number
  private _viewPosH: number
  private _w:number
  private _h:number

  /** initial_valueは参照渡しされる */
  constructor(initial_value: Pixcel | Array<Array<Pixcel>>, width?: number | null, height?: number | null){
    if (implementsPixcel(initial_value)) {
      if(width === null || width === undefined){ width = PixcelMapBase.w}
      if(height === null || height === undefined){ height = PixcelMapBase.h}
      this._w = width
      this._h = height
      const baseAry = (new Array<Array<null>>(this._h)).fill(new Array<null>(this._w).fill(null))
      this.value = baseAry.map(row => row.map(_ => initial_value))//.map((x) => x.map( (y) => initial_value.copy() ))
    } else {
      this.value = initial_value
      this._w = initial_value[0].length
      this._h = initial_value.length
    }
    this._viewPosX = 0
    this._viewPosY = 0
    this._viewPosW = PixcelMapBase.w
    this._viewPosH = PixcelMapBase.h
  }
  get = (i:number, j:number) => this.value[i+this._viewPosX][j+this._viewPosY]
  getCode = () => this.value.map((row)=>row.map((pix) => pix.genCode()))
  update = (w:number, h:number) => {
    if(this.needUpdate(w,h)){
      this.value = (new Array<Array<Pixcel>>()) 
    }
  }
  superpose = (base: PixcelMap, type: MIX_TYPE, clip: boolean) => {
    return new PixcelMap(base.value.map(
        (row, i) => row.map(
          (pixcel, j) => pixcel.add(this.get(i,j), type, clip)
        )
      )
    )
  }
}