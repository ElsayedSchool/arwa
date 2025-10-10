export class UpdateDeliveryItemRestAmountsCommand {
  constructor(
    public deliveryId: string,
    public itemUpdates: Array<{
      deliveryItemId: string;
      restAmount: number;
    }>
  ) {}
}
