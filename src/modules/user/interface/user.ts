export type Register_Request_Interface = {
  username: string;
  password: string;
};

export type Register_Response_Interface = {
  status: 'success' | 'fail';
  message: string;
  token?: string;
};

export type Login_Request_Interface = {
  username: string;
  password: string;
};

export type Login_Response_Interface = {
  status: 'success' | 'fail';
  message: string;
  token?: string;
};
