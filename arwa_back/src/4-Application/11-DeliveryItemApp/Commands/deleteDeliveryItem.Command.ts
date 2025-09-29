export class DeleteDeliveryItemCommand {
  constructor(
    public id: string,
    public deletedById?: string,
    public deletedByName?: string
  ) {}
}
