export class GetAllOrderQuery {
  constructor(
    public readonly dateFilter?: string,
    public readonly dateFrom?: string,
    public readonly dateTo?: string
  ) {}
}
