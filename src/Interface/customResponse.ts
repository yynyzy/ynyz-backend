export class CustomResponse<T> {
  constructor(public statusCode: number, public data: T) {}
}
