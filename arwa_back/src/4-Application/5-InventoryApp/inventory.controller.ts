import { Controller, Get } from "@nestjs/common";

@Controller("inventory")
export class InventoryController {
  @Get()
  ping() {
    return { ok: true, name: "InventoryController" };
  }
}
