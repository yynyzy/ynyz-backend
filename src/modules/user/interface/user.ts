import { BaseResponse } from 'src/common/Interface/commonResponse';
import { IUser } from 'src/common/Interface/entityMappingInterface';
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

export type ISignOut_Response = BaseResponse;

export interface ISearch_User_Response extends BaseResponse {
  user?: IUser;
}
