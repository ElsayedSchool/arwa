import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
@Injectable()
export class BcryptService {
  async getHashedPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }

  async getHashedVerificationCode(code: string): Promise<string> {
    const salt = await genSalt();
    return await hash(code, salt);
  }

  async getRandomCode() {
    return Math.floor(Math.random() * 90000000 + 10000000).toString();
  }

  async isPasswordValid(
    loginPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return await compare(loginPassword, storedPassword);
  }

  async isCodeValid(sentCode: string, storedCode: string): Promise<boolean> {
    return await compare(sentCode, storedCode);
  }

  async getHashedKey(query: any) {
    return JSON.stringify(query);
  }
}
