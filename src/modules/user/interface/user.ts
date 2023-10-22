import { BaseResponse } from 'src/common/Interface/commonResponse';
import { TOKEN } from 'src/modules/auth/interface/auth';

export interface IRegister_Body {
  username: string;
  password: string;
}

export interface ILogin_Body {
  username: string;
  password: string;
}

export interface IRegisterAndLogin_Response extends BaseResponse {
  message?: string;
  token?: TOKEN;
}

export type SignOut_Response = BaseResponse;

type Search_User = {
  id: number;
  username: string;
  avatar: string;
};

export interface Search_User_Response extends BaseResponse {
  user?: Search_User;
}
