import { BaseEntity as TypeOrmBaseEntity, PrimaryColumn } from 'typeorm';

export abstract class BaseEntityStr extends TypeOrmBaseEntity {
  @PrimaryColumn()
  id: string;
}
