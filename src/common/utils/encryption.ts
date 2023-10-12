import * as crypto from 'crypto';

export class Crypto {
  static addSalt = (): string => {
    return crypto.randomBytes(3).toString('base64');
  };

  static encrypt = (password: string, salt: string): string => {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 16, 'sha256')
      .toString('base64');
  };
}
