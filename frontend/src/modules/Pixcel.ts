import { MIX_TYPE } from './MixType'
export default interface Pixcel{
  code: string
  add(x:Pixcel, type: MIX_TYPE, clip: boolean): Pixcel
  copy(): Pixcel
  genCode(): string
}
export function implementsPixcel(arg: any): arg is Pixcel {
  return arg !== null&&
    typeof arg === "object" &&
    typeof arg.add === "function" &&
    typeof arg.copy === "function"
}