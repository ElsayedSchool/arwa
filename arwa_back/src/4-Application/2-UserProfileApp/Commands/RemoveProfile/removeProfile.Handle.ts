import { ProfileRepo } from 'src/3-Infrastructure/Repositories';
import { RemoveProfileCommand } from './removeProfile.Command';
import { Injectable } from '@nestjs/common';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';
import { RespDto } from 'src/1-Core/Models/response.model';

@Injectable()
export class RemoveProfileHandler {
  constructor(private readonly profileRepo: ProfileRepo) {}
  async handle(
    command: RemoveProfileCommand,
    user: JWTToken,
  ): Promise<RespDto> {
    return new RespDto().getOkResponse(
      await this.profileRepo.removeByIdAsync(user.id),
    );
  }
}
