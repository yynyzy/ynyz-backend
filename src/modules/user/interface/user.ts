import { RESPONSE_STATUS } from 'src/common/constant/constant';

type Register_And_Login_Response_User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  // status: number;
};

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
  user?: Register_And_Login_Response_User;
};
