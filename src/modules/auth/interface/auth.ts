import { RESPONSE_STATUS } from 'src/common/constant/constant';

export type JWT_Certificate_Response = {
  status: RESPONSE_STATUS;
  token?: string;
};

export type validate_User_Password_Params = {
  password: string;
  hashedPassword: string;
  salt: string;
};
