import { BaseResponse } from 'src/common/Interface/commonResponse';

export interface TOKEN {
  assess_token: string;
  refresh_token: string;
}

export interface JWT_Certificate_Response extends BaseResponse {
  token?: TOKEN;
}

export interface validate_User_Password_Params {
  password: string;
  hashedPassword: string;
  salt: string;
}
