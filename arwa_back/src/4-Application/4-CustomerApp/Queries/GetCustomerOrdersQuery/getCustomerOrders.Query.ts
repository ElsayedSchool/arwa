export interface GetCustomerOrdersFilter {
  customerId: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  exactDate?: string; // ISO date to filter single day
}

export class GetCustomerOrdersQuery {
  constructor(public filter: GetCustomerOrdersFilter) {}
}
