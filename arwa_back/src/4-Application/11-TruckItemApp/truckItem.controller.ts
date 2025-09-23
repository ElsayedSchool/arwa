import { Controller, Get } from "@nestjs/common";

@Controller("truck-item")
export class TruckItemController {
  @Get()
  ping() {
    return { ok: true, name: "TruckItemController" };
  }
}
