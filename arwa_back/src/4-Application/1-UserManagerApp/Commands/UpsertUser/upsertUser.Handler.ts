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
      userData.isAdmin = true;
      userData.emailConfirmed = true;
      userData.isProfileInit = true;
    }
    userData.roles = this.getRoles(command.roles);
    console.log("userData", userData, command.roles);
    userData.isActive = (command.isActive as unknown as string) == "true";
    userData.password = await this.hashSer.getHashedPassword(command.password);

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
    return await this.authSer.createNewUser(
      userReqData,
      command.password,
      command.username.toLowerCase()
    );
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
    return user;
  }

  getRoles(roles: string) {
    const userRoles = roles.split(",");
    const updatedRoles = [];
    userRoles.forEach((element) => {
      if (Object.values(UserRole).includes(element as UserRole))
        updatedRoles.push(element);
    });
    return updatedRoles;
  }
}
