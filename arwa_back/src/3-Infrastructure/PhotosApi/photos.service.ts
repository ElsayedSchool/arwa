import * as path from 'path';
import * as fs from 'fs';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { isNotEmpty } from 'class-validator';

export class ValidFiles {
  constructor(
    public fileName: string,
    public fileContent: Express.Multer.File,
  ) {}
}

@Injectable()
export class PhotosService {
  private storagePath: string;

  constructor(
    @Inject('Logger') private log: Logger,
    private configSer: ConfigService,
  ) {
    this.storagePath = path.join(__dirname, '../../..', 'uploads');
    if (!existsSync(this.storagePath)) mkdirSync(this.storagePath);
  }
  // GetValidFilesNames
  async getValidFilesName(
    photos: Express.Multer.File[],
  ): Promise<ValidFiles[]> {
    const validFiles: ValidFiles[] = [];
    if (photos?.length) {
      photos.forEach((photo) => {
        if (this.isValidPhotoFile(photo)) {
          const fileName = `${uuid()}${extname(photo.originalname)}`;
          validFiles.push(new ValidFiles(fileName, photo));
        }
      });
      return validFiles;
    }
    return [];
  }

  async storePhotos(files: ValidFiles[]): Promise<boolean> {
    try {
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.storagePath, file.fileName);
          await fs.promises.writeFile(filePath, file.fileContent.buffer);
        }),
      );
      return true;
    } catch (error) {
      this.log.error('Error storing photos:', error);
      throw new InternalServerErrorException('حدث خطا أثناء حفظ الصور');
    }
  }

  async UpdatePhotos(
    removedFilesList: string[],
    newPhotos: any[],
  ): Promise<string[]> {
    await this.RemovePhotos(removedFilesList);
    const validPhotos = await this.getValidFilesName(newPhotos);
    await this.storePhotos(validPhotos);
    const storedPhotosNames = [];
    validPhotos.forEach((p) => {
      storedPhotosNames.push(p.fileName);
    });
    return storedPhotosNames;
  }

  async UpdatePhotosAsync(
    currentPhotos: string[],
    removedPhotos: string[],
    newPhotos: Express.Multer.File[],
  ): Promise<{ newPhotosArray: string[]; newPhotosFiles: any[] }> {
    const newValidphotosFiles = await this.getValidFilesName(newPhotos);

    // get new photos array
    const newValidPhotosNames = this.getPhotosNames(newValidphotosFiles);

    const updatedOldPhotosNamesArray = await this.getUpdatedOldPhotos(
      currentPhotos,
      removedPhotos,
    );

    return {
      newPhotosArray: [...updatedOldPhotosNamesArray, ...newValidPhotosNames],
      newPhotosFiles: newValidphotosFiles,
    };
  }

  async getUpdatedOldPhotos(
    currentPhotos: string[],
    removedPhotos: string[],
  ): Promise<string[]> {
    if (removedPhotos.length == 0) return currentPhotos;
    if (typeof removedPhotos == 'string') removedPhotos = [removedPhotos];
    const validRemovedPhotos = removedPhotos.filter((removed) =>
      currentPhotos.includes(removed),
    );

    const validOldPhotos = currentPhotos.filter(
      (old) => !removedPhotos.includes(old),
    );
    await this.RemovePhotos(validRemovedPhotos);
    return validOldPhotos;
  }

  // remove Valid Photos on the server
  async RemovePhotos(filesPathes: string[]): Promise<boolean> {
    try {
      const paths = this.convertFileUrlToName(filesPathes);
      await Promise.all(
        paths.map(async (file) => {
          const filePath = path.join(this.storagePath, file);
          if ((await fs.promises.lstat(filePath)).isFile())
            await fs.promises.unlink(filePath);
        }),
      );
      return true;
    } catch (error) {
      this.log.error('Error storing photos:', error);
      throw new InternalServerErrorException('حدث خطا اثناء ازاله الصور');
    }
  }

  private convertFileUrlToName(filesPathes: string[]) {
    const newPaths = filesPathes.map((val) => {
      return val.slice(val.lastIndexOf('/') + 1);
    });
    return newPaths;
  }

  getPhotosNames(photosFiles: ValidFiles[]): string[] {
    const photos = [];
    photosFiles.forEach((p) => {
      photos.push(p.fileName);
    });
    return photos;
  }

  // validate Photos fileType
  private isValidPhotoFile(file: Express.Multer.File): boolean {
    return file.mimetype.match(/\/(jpg|jpeg|png|gif)$/) ? true : false;
  }

  getCompletePhotoUrl(photoName: string) {
    return `${this.configSer.get('HOST_URL')}${photoName}`;
  }

  async getUpdatedOldPhotosData(
    currentPhotos: string[],
    removedPhotos: string[],
  ): Promise<{ validOldPhotos: string[]; validRemovedPhotos: string[] }> {
    if (removedPhotos.length == 0)
      return { validOldPhotos: currentPhotos, validRemovedPhotos: [] };
    if (typeof removedPhotos == 'string') removedPhotos = [removedPhotos];
    const validRemovedPhotos = removedPhotos.filter((removed) =>
      currentPhotos.includes(removed),
    );

    const validOldPhotos = currentPhotos.filter(
      (old) => !removedPhotos.includes(old),
    );
    return { validOldPhotos, validRemovedPhotos };
  }
}
