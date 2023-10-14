export type Auth_Register_Request_Interface = {
  username: string;
  password: string;
};

export type Auth_Register_Response_Interface = {
  status: 'success' | 'fail';
  userId: number;
  message: string;
};
