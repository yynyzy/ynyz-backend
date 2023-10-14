export type Auth_Register_Interface = {
  username: string;
  password: string;
};

export type Auth_Response_Interface = {
  status: 'success' | 'fail';
  userId: number;
  message: string;
};
