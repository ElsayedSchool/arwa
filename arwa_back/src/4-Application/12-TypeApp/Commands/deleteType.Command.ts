export class DeleteTypeCommand {
  constructor(
    public id: string,
    public deletedById?: string,
    public deletedByName?: string
  ) {}
}
