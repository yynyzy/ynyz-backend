import { RESPONSE_STATUS } from 'src/common/constant/constant';

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
  token?: string;
};
