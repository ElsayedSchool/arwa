import { UserProfile } from "src/2-Domain";
import { IBaseRepository } from "../Base/base.interface.repository";
import { BaseRepository } from "../Base/base.abstract.repository";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logger } from "winston";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProfileRepo extends IBaseRepository<UserProfile> {}

export class ProfileRepo
  extends BaseRepository<UserProfile>
  implements IProfileRepo
{
  constructor(
    @InjectRepository(UserProfile)
    private db: Repository<UserProfile>,
    @Inject("Logger") private log: Logger
  ) {
    super(db, log);
  }

  async getProfileDetailById(id: string): Promise<UserProfile> {
    return await this.db.findOne({
      where: { id: id },
    });
  }
}
