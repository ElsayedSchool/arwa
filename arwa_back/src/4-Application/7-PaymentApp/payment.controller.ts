import { Controller, Get } from "@nestjs/common";

@Controller("payment")
export class PaymentController {
  @Get()
  ping() {
    return { ok: true, name: "PaymentController" };
  }
}
