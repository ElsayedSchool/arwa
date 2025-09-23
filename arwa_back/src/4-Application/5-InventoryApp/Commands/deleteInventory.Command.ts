export class DeleteInventoryCommand {
  constructor(
    public id: string,
    public deletedById?: string,
    public deletedByName?: string
  ) {}
}
