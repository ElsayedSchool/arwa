import { Controller, Get } from "@nestjs/common";

@Controller("type")
export class TypeController {
  @Get()
  ping() {
    return { ok: true, name: "TypeController" };
  }
}
