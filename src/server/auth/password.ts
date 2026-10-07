import crypto from 'node:crypto';

const SALT_SIZE = 16;
const KEY_LEN = 64;
const ITERATIONS = 100000;
const DIGEST = 'sha512';

export class PasswordHasher {
  public static async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(SALT_SIZE).toString('hex');
      crypto.pbkdf2(password, salt, ITERATIONS, KEY_LEN, DIGEST, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  public static async verify(password: string, combinedHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      const [salt, originalHash] = combinedHash.split(':');
      if (!salt || !originalHash) return resolve(false);

      crypto.pbkdf2(password, salt, ITERATIONS, KEY_LEN, DIGEST, (err, derivedKey) => {
        if (err) return resolve(false);

        const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
        const originalBuffer = Buffer.from(originalHash, 'hex');

        if (keyBuffer.length !== originalBuffer.length) {
          return resolve(false);
        }

        const isMatch = crypto.timingSafeEqual(keyBuffer, originalBuffer);
        resolve(isMatch);
      });
    });
  }
}
