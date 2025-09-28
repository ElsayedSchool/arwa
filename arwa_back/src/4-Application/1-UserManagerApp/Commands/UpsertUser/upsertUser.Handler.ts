import { UserRepo } from "src/3-Infrastructure/Repositories";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthProvider, User, UserRole } from "src/2-Domain";
import { AuthService } from "src/4-Application/0-AuthenticationApp/auth.service";
import { UserData } from "src/3-Infrastructure/Authentication/AuthModels/user-data-model";
import { UpsertUserCommand } from "./upsertUser.Command";
import { PhotosService } from "src/3-Infrastructure/PhotosApi/photos.service";
import { BcryptService } from "../../../../3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";

@Injectable()
export class UpsertUserHandler {
  constructor(
    private authRepo: UserRepo,
    private authSer: AuthService,
    private photosSer: PhotosService,
    private hashSer: BcryptService
  ) {}

  async handle(command: UpsertUserCommand, photos: Express.Multer.File[]) {
    let userData: User;
    const oldPhoto = "";
    if (command.id) {
      userData = await this.onUpdateUser(command);
    } else {
      userData = await this.onCreateNewUser(command);
      userData.emailConfirmed = true;
      userData.isProfileInit = true;
    }
    userData.roles = this.getRoles(command.roles as any);
    // allow explicitly controlling admin flag, default false when not provided
    if (typeof command.isAdmin === "boolean") {
      userData.isAdmin = command.isAdmin;
    } else if (!command.id) {
      userData.isAdmin = false;
    }
    userData.isActive =
      (command.isActive as unknown as boolean) === true ||
      (command.isActive as unknown as string) === "true";
    // Ensure password is hashed (createNewUser may already hash it, but update path needs it)
    if (command.password) {
      userData.password = await this.hashSer.getHashedPassword(
        command.password
      );
    }

    //store valid photos on disk and set Question photos names
    const validPhotos = await this.photosSer.getValidFilesName(photos);
    const isCreated = await this.authRepo.saveAsync(userData);
    if (isCreated) {
      if (validPhotos.length) {
        await this.photosSer.storePhotos(validPhotos);
        if (oldPhoto) await this.photosSer.RemovePhotos([oldPhoto]);
      }
    }
    return isCreated;
  }

  async onCreateNewUser(command: UpsertUserCommand) {
    const user = await this.authRepo.getUserByIdAndProvider(
      command.username.toLowerCase(),
      AuthProvider.Credential
    );
    if (user)
      throw new BadRequestException(
        "الحساب موجود بقاعده البيانات يمكنك تسجيل الدخول"
      );

    const isEmailExist = await this.authRepo.isEmailExist(
      command.email.toLowerCase()
    );
    if (isEmailExist)
      throw new BadRequestException(
        "الحساب موجود بقاعده البيانات يمكنك تسجيل الدخول"
      );
    const userReqData = new UserData();
    userReqData.name = command.username.toLowerCase();
    userReqData.email = command.email.toLowerCase();
    userReqData.provider = AuthProvider.Credential;
    const created = await this.authSer.createNewUser(
      userReqData,
      command.password,
      command.username.toLowerCase()
    );
    // map extra fields to profile (phone/salary)
    if (!created.userProfile) {
      created.userProfile = { id: created.id } as any;
    }
    // set profile name from first/last
    (created.userProfile as any).name = `${command.firstName ?? ""} ${
      command.lastName ?? ""
    }`.trim();
    if (command.phoneNumber) {
      (created.userProfile as any).phoneNumber = command.phoneNumber;
    }
    if (typeof command.salary === "number") {
      (created.userProfile as any).salary = command.salary;
    }
    return created;
  }

  async onUpdateUser(command: UpsertUserCommand) {
    const user = await this.authRepo.getUserDetailById(command.id);
    if (user.email != command.email) {
      const isEmailExist = await this.authRepo.isEmailExist(
        command.email.toLowerCase()
      );
      if (isEmailExist)
        throw new BadRequestException(
          "الايميل موجود بقاعده البيانات برجاء اسستخدام حساب اخر"
        );
    }

    user.email = command.email;
    // update profile fields if provided
    if (!user.userProfile) {
      user.userProfile = { id: user.id } as any;
    }
    if (user.userProfile) {
      // update profile name
      if (command.firstName || command.lastName) {
        (user.userProfile as any).name = `${command.firstName ?? ""} ${
          command.lastName ?? ""
        }`.trim();
      }
      if (typeof command.salary === "number") {
        (user.userProfile as any).salary = command.salary;
      }
      if (typeof command.phoneNumber === "string") {
        (user.userProfile as any).phoneNumber = command.phoneNumber;
      }
    }
    return user;
  }

  getRoles(roles: string | string[]) {
    const userRoles = Array.isArray(roles)
      ? roles
      : typeof roles === "string"
        ? roles.split(",")
        : [];
    const updatedRoles = [];
    userRoles.forEach((element) => {
      if (Object.values(UserRole).includes(element as UserRole))
        updatedRoles.push(element);
    });
    return updatedRoles;
  }
}
