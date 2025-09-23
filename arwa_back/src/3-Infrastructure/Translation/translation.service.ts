import { Injectable } from '@nestjs/common';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslateService {
  constructor(private readonly transSer: I18nService) {}

  trans(text: string): string {
    return this.transSer.t(text, { lang: I18nContext.current().lang });
  }
}
