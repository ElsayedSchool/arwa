import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CachingService } from './caching.service';
import { BcryptService } from '../Authentication/Bcrypt/bycrypt.Service';

@Module({
  imports: [ConfigModule],
  exports: [CachingService],
  providers: [CachingService, BcryptService],
})
export class CachingModule {}
