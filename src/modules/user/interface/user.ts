type Register_And_Login_Response_User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  // status: number;
};

export type Register_Request = {
  username: string;
  password: string;
};

export type Login_Request = {
  username: string;
  password: string;
};

export type Register_And_Login_Response = {
  status: 'success' | 'fail';
  message?: string;
  token?: string;
  user?: Register_And_Login_Response_User;
};
