import { Module } from '@nestjs/common';
import { TranslateService } from './translation.service';

@Module({ providers: [TranslateService], exports: [TranslateService] })
export class TranslateModule {}
