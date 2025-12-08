export class ResponseDto<T = any> {
  constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly message?: string,
    public readonly errors?: any[],
  ) {}

  static success<T>(data: T, message?: string): ResponseDto<T> {
    return new ResponseDto(true, data, message);
  }

  static error(message: string, errors?: any[]): ResponseDto<undefined> {
    return new ResponseDto(false, undefined, message, errors);
  }
}
