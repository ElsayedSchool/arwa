import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual, LessThan } from "typeorm";
import { Order } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class OrderRepo extends BaseRepository<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo);
  }

  async hasAnyTodayOrders(): Promise<boolean> {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const count = await this.repo.count({
        where: {
          createAt: MoreThanOrEqual(startOfDay) && LessThan(endOfDay),
          isDeleted: false, // Assuming BaseDelete has isDeleted
        },
      });

      return count > 0;
    } catch (error) {
      console.error("Error checking for today's orders:", error);
      return false; // Return false on error
    }
  }
}
