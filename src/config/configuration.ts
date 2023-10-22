export const DEV_CONFIG = {
  port: 3000,
  jwtSecret: 'yanzhiyuan',
  JWT_EXPIRES_IN: '300000',
  database: {
    DB_DIALECT: 'mysql',
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_DATABASE: 'yzyn',
    DB_USERNAME: 'root',
    DB_PASSWORD: 'yyn990902',
  },
  redis: {
    HOST: 'localhost',
    PORT: 6379,
    PASSWORD: '123456',
  },
};

export const PROD_CONFIG = {
  port: 3001,
  jwtSecret: 'yanzhiyuan',
  JWT_EXPIRES_IN: '300000',
  database: {
    DB_DIALECT: 'mysql',
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_DATABASE: 'yzyn',
    DB_USERNAME: 'root',
    DB_PASSWORD: 'yyn990902',
  },
  redis: {
    HOST: 'localhost',
    PORT: 6379,
    PASSWORD: '123456',
  },
};

export default () => {
  return process.env.RUNNING_ENV === 'dev' ? DEV_CONFIG : PROD_CONFIG;
};
