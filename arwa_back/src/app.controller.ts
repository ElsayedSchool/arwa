import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user')
  getdata(): string {
    return this.appService.getHello();
  }

  @Post()
  addData(@Body() name: string): string {
    console.log(name);
    return `my Name is ${name}`;
  }
}
