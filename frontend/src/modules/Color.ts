import Pixcel from './Pixcel'
import ApplicationError from './Error'
import { MIX_TYPE } from './MixType';

export default class Color implements Pixcel{
  public r:number = 0
  public g:number = 0
  public b:number = 0
  public a:number = 0
  private _code: string = "#000000"
  public get code() {return this._code}

  constructor(r:number = 0, g:number = 0, b:number = 0, a:number = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  copy():Color {
    return new Color(this.r, this.g, this.b, this.a)
  }

  add(pix: Pixcel, type: MIX_TYPE, clip: boolean):Pixcel {
    if (pix instanceof Color) {
      return this.addColor(pix, type, clip)
    }else{
      throw new ApplicationError("no implementation type add")
    }
  }

  addColor(col: Color, type: MIX_TYPE, clip: boolean): Color{
    switch(type) {
      case MIX_TYPE.PLANE:
        if(clip){
          return this.clip_plane_add(col)
        } else {
          return this.plane_add(col)
        }
      default:
        throw new ApplicationError('no implementation error')
    }
  }

  map<T>(f:(n:number)=>T):Array<T>;
  map<T>(f:(n:number,i:number)=>any):Array<T> {
    return [f(this.r,0) , f(this.g,1), f(this.b,2)];
  }
  
  genCode():string{
    return this._code = [
      "#"
      ,("0" + this.to_hex(this.r)).slice(-2)
      ,("0" + this.to_hex(this.g)).slice(-2)
      ,("0" + this.to_hex(this.b)).slice(-2)
    ].join("")
  }

  to_hex = (x:number) => parseInt(x.toString(10)).toString(16)
  
  /** 通常の合成で加算したColorを生成して返す */
  private plane_add(col: Color) {
    let new_color = new Color();
    new_color.r = this.weightAverage(this.r,this.a,col.r,col.a);
    new_color.g = this.weightAverage(this.g,this.a,col.g,col.a);
    new_color.b = this.weightAverage(this.b,this.a,col.b,col.a);
    new_color.a = this.a + col.a
    if(new_color.a > 1){
      new_color.a = 1
    }
    console.log('p')
    return new_color;
  }

  /** クリッピング合成したColorを生成して返す */
  private clip_plane_add(col: Color){
    console.log('c')
    let new_color = new Color();
    if(this.a > 0){
      new_color.r = this.weightAverage(this.r,1,col.r,col.a);
      new_color.g = this.weightAverage(this.g,1,col.g,col.a);
      new_color.b = this.weightAverage(this.b,1,col.b,col.a);
    } else {
      new_color.r = this.r
      new_color.g = this.g
      new_color.b = this.b
    }
    new_color.a = this.a
    return new_color;
  }

  private weightAverage(x: number,ax: number,y: number, ay: number){
    if(ax+ay <= 0){
      return 0
    }
    return (x*(1-ay)*ax+y*ay);
  }
}
