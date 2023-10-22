import { RESPONSE_STATUS } from '../constant/constant';

export interface CustomResponse<T> {
  statusCode: string;
  data: T;
}

export interface BaseResponse {
  status: RESPONSE_STATUS;
}
