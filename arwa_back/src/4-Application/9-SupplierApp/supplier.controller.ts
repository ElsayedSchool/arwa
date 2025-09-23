import { Controller, Get } from "@nestjs/common";

@Controller("supplier")
export class SupplierController {
  @Get()
  ping() {
    return { ok: true, name: "SupplierController" };
  }
}
