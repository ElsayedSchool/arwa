export class CreatePaymentDeliveryCommand {
  constructor(
    public supplierId: string,
    public supplierName: string,
    public paidAmount: number,
    public discount: number,
    public driverName: string
  ) {}
}

export class UpdatePaymentDeliveryCommand {
  constructor(
    public id: string,
    public supplierId: string,
    public supplierName: string,
    public paidAmount: number,
    public discount: number,
    public driverName: string
  ) {}
}
