import { Controller, Get } from "@nestjs/common";

@Controller("order")
export class OrderController {
  @Get()
  ping() {
    return { ok: true, name: "OrderController" };
  }
}
