export class UpsertCustomerCommand {
  constructor(
    public id?: string,
    public name?: string,
    public nickname?: string,
    public phoneNumber?: string
  ) {}
}
