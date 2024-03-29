export default class ApplicationError implements Error {
  public name = 'ApplicationError';

  constructor(public message: string) {
  }

  toString() {
    return this.name + ': ' + this.message;
  }
}