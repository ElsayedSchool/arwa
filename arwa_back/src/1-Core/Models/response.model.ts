export class RespDto {
  statusCode = 200;
  message = '';
  error = '';
  data: any;

  getOkResponse(data: any) {
    this.data = data;
    return this;
  }

  getBadRequest(message: string) {
    this.statusCode = 400;
    this.message = message;
    this.error = 'Bad Request';
    this.data = null;
    return this;
  }

  getunAuthorizedRequest(message: string) {
    this.statusCode = 401;
    this.message = message;
    this.error = 'unAuthorized';
    this.data = null;
    return this;
  }
}
