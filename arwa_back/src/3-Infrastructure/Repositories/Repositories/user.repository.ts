import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthProvider, User } from "src/2-Domain";
import { DeepPartial, Repository } from "typeorm";
import { Logger } from "winston";
import { IBaseRepository } from "../Base/base.interface.repository";
import { BaseRepository } from "../Base/base.abstract.repository";
import { InjectRepository } from "@nestjs/typeorm";

export interface IUserRepo extends IBaseRepository<User> {
  getUserByIdAndProvider(userId: string, provider: AuthProvider): Promise<User>;
  isUserExists(id: string): Promise<boolean>;
}

export class UserRepo extends BaseRepository<User> implements IUserRepo {
  constructor(
    @InjectRepository(User)
    private db: Repository<User>,
    @Inject("Logger") private log: Logger
  ) {
    super(db, log);
  }

  async getAllAdminUsers() {
    try {
      return await this.db.find({
        where: { isAdmin: true },
        relations: { userProfile: true },
        select: {
          id: true,
          username: true,
          email: true,
          roles: true,
          isActive: true,
          password: true,
          userProfile: {
            profilePhoto: true,
          },
        },
      });
    } catch (error) {
      this.log.error("getAllAdminUsers", error);
    }
  }
  async getCouinsOfUser(userId: string) {
    const user = await this.db.find({
      where: { id: userId },
      relations: { userProfile: true },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        isActive: true,
      },
    });
    return user[0];
  }

  async getUserByProviderAndProviderId(
    providerId: string,
    authProvider: AuthProvider
  ): Promise<User> {
    try {
      const user = await this.db.findOne({
        where: { userProviderId: providerId, authProvider },
        relations: { userProfile: true },
      });
      /* if (!user)
        throw new NotFoundException('اسم المستخدم او كلمه المرور غير صحيحه'); */
      return user;
    } catch (error) {
      this.log.error("get User by username Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserByEmailForCredentials(email: string): Promise<User> {
    try {
      const user = await this.db.findOne({
        where: { email, authProvider: AuthProvider.Credential },
      });
      return user;
    } catch (error) {
      this.log.error("get User by email for credentials Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.db.findOne({
        where: { email },
        relations: { userProfile: true },
      });
      return user;
    } catch (error) {
      this.log.error("get User by email for credentials Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      const user = await this.db.findOne({
        where: { username: username },
        relations: { userProfile: true },
      });
      /* if (!user)
        throw new NotFoundException('اسم المستخدم او كلمه المرور غير صحيحه'); */
      return user;
    } catch (error) {
      this.log.error("get User by username Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserDetailById(id: string): Promise<User> {
    try {
      const user = await this.db.findOne({
        where: { id: id },
        relations: { userProfile: true },
      });
      if (!user) throw new NotFoundException("لايوجد بيانات للمستخدم");
      return user;
    } catch (error) {
      this.log.error("get User by email Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserByIdAndProvider(
    username: string,
    authProvider: AuthProvider
  ): Promise<User> {
    try {
      return await this.db.findOneBy({
        username,
        authProvider,
      });
    } catch (error) {
      this.log.error("get User by username Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاء بيانات المستخدم برجاء تسجيل الدخول مره اخرى"
      );
    }
  }

  async isUserExists(id: string): Promise<boolean> {
    const user = await this.db.findOne({ where: { id } });
    return !!user;
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.db.findOne({ where: { email } });
    return !!user;
  }

  override async removeByIdAsync(id: string): Promise<boolean> {
    try {
      const resp = await this.db.delete(id);
      return resp.affected >= 1;
    } catch (error) {
      this.log.error("get User by username Error:", error);
      throw new InternalServerErrorException(
        "حدث خطا اثناء حذف بيانات المستخدم برجاء المحاوله مره اخرى"
      );
    }
  }

  async getUserByIdAndRefreshToken(id: string, refreshToken: string) {
    try {
      return await this.db.findOne({
        where: { id, refreshToken },
        relations: { userProfile: true },
      });
    } catch (error) {
      this.log.error("is refresh token exists", error);
      throw new UnauthorizedException("من فضلك قم بتسجل الدخول");
    }
  }

  public async saveUserAsync(data: DeepPartial<User>) {
    try {
      return await this.db.save(data);
    } catch (err) {
      this.log.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء حفظ البيانات الجديده برجاء المحاوله مره اخرى"
      );
    }
  }
}
