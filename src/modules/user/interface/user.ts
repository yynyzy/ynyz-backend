import { RESPONSE_STATUS } from 'src/common/constant/constant';
import { TOKEN } from 'src/modules/auth/interface/auth';

export type IRegister_Body = {
  username: string;
  password: string;
};

export type ILogin_Body = {
  username: string;
  password: string;
};

export type IRegisterAndLogin_Response = {
  status: RESPONSE_STATUS;
  message?: string;
  token?: TOKEN;
};

export type SignOut_Response = {
  status: RESPONSE_STATUS;
};
