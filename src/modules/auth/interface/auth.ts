export type JWT_Certificate_Res = {
  status: 'success' | 'fail';
  token?: string;
};

export type validate_User_Password_Params = {
  password: string;
  hashedPassword: string;
  salt: string;
};
