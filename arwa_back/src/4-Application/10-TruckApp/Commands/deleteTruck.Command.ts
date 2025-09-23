export class DeleteTruckCommand {
  constructor(
    public id: string,
    public deletedById?: string,
    public deletedByName?: string
  ) {}
}
