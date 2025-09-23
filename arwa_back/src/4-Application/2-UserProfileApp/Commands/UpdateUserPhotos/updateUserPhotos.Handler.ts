import { PhotosService } from 'src/3-Infrastructure/PhotosApi/photos.service';
import { UpdateUserPhotosCommand } from './updateUserPhotos.Command';
import { ProfileRepo } from 'src/3-Infrastructure/Repositories';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RespDto } from 'src/1-Core/Models/response.model';

@Injectable()
export class UpdateUserPhotosHandler {
  constructor(
    private PhotoSer: PhotosService,
    private profileRepo: ProfileRepo,
  ) {}

  async handle(
    photos: Express.Multer.File[],
    command: UpdateUserPhotosCommand,
    user: JWTToken,
  ): Promise<RespDto> {
    const profile = await this.profileRepo.findByIdAsync(user.id);
    const validPhotos = await this.PhotoSer.getValidFilesName(photos);
    if (validPhotos.length) {
      const oldPhoto = profile.profilePhoto;
      profile.profilePhoto = this.PhotoSer.getCompletePhotoUrl(
        validPhotos[0].fileName,
      );
      const isUpdated = await this.profileRepo.saveAsync(profile);
      if (isUpdated) {
        await this.PhotoSer.storePhotos(validPhotos);
        await this.PhotoSer.RemovePhotos([oldPhoto]);
      }

      return new RespDto().getOkResponse(profile);
    }

    throw new BadRequestException('من فضلك ارسل صوره شخصيه');
  }
}
