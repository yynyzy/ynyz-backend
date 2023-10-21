import { RESPONSE_STATUS } from 'src/common/constant/constant';

export type TOKEN = {
  assess_token: string;
  refresh_token: string;
};

export type JWT_Certificate_Response = {
  status: RESPONSE_STATUS;
  token?: TOKEN;
};

export type validate_User_Password_Params = {
  password: string;
  hashedPassword: string;
  salt: string;
};
