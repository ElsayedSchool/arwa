export class DeletePaymentCommand {
  constructor(
    public id: string,
    public deletedById?: string,
    public deletedByName?: string
  ) {}
}
