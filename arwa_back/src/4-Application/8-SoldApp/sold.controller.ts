import { Controller, Get } from "@nestjs/common";

@Controller("sold")
export class SoldController {
  @Get()
  ping() {
    return { ok: true, name: "SoldController" };
  }
}
