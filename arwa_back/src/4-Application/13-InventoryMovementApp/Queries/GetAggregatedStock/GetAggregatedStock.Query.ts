import { IQuery } from '@nestjs/cqrs';

export class GetAggregatedStockQuery implements IQuery {
  constructor(
    public readonly supplierId: string,
    public readonly isStock: boolean
  ) {}
}
