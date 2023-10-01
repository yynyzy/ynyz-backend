export type Account_Register_Dto = {
  username: string;
  password: string;
};

export type Account_Register_Response = {
  status: 'success' | 'fail';
  message: string;
};
