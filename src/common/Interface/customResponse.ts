export class CustomResponse<T> {
  constructor(public statusCode: string, public data: T) {}
}
