import { Controller, Get } from "@nestjs/common";

@Controller("truck")
export class TruckController {
  @Get()
  ping() {
    return { ok: true, name: "TruckController" };
  }
}
