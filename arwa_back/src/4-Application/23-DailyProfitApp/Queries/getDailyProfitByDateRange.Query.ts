export class GetDailyProfitByDateRangeQuery {
  constructor(
    public startDate: Date,
    public endDate: Date
  ) {}
}
