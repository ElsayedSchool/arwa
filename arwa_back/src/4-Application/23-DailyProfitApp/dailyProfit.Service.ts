import { Injectable, Inject } from "@nestjs/common";
import {
  DailyProfitRepo,
  ExpenseRepo,
  DeliveryItemRepo,
  OrderRepo,
} from "src/3-Infrastructure/Repositories";
import { DailyProfit } from "src/2-Domain";
import { Logger } from "winston";
import { Between } from "typeorm";

@Injectable()
export class DailyProfitService {
  constructor(
    private dailyProfitRepo: DailyProfitRepo,
    private expenseRepo: ExpenseRepo,
    private deliveryItemRepo: DeliveryItemRepo,
    private orderRepo: OrderRepo,
    @Inject("Logger") private log: Logger
  ) {}

  async calculateDailyProfit(date: Date): Promise<DailyProfit> {
    try {
      this.log.info(
        `Calculating daily profit for date: ${date.toISOString().split("T")[0]}`
      );

      // Check if daily profit already exists for this date
      const existingProfit = await this.dailyProfitRepo.findAllAsync({
        where: {
          profitDate: date,
          isDeleted: false,
        },
      });

      if (existingProfit.length > 0) {
        this.log.info(
          `Daily profit already exists for date: ${date.toISOString().split("T")[0]}`
        );
        return existingProfit[0];
      }

      // Calculate date range for the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 1. Calculate total salary expenses (staff payments)
      const salaryExpenses = await this.calculateTotalSalaryExpenses(
        startOfDay,
        endOfDay
      );

      // 2. Calculate total normal expenses
      const normalExpenses = await this.calculateTotalNormalExpenses(
        startOfDay,
        endOfDay
      );

      // 3. Calculate total sold fish price
      const soldFishPrice = await this.calculateTotalSoldFishPrice(
        startOfDay,
        endOfDay
      );

      // 4. Calculate total orders sold revenue
      const ordersRevenue = await this.calculateTotalOrdersRevenue(
        startOfDay,
        endOfDay
      );

      // 5. Calculate net profit
      const netProfit =
        ordersRevenue - soldFishPrice - salaryExpenses - normalExpenses;

      // Create daily profit record
      const dailyProfit = new DailyProfit();
      dailyProfit.profitDate = date;
      dailyProfit.totalSalaryExpenses = salaryExpenses;
      dailyProfit.totalNormalExpenses = normalExpenses;
      dailyProfit.totalSoldFishPrice = soldFishPrice;
      dailyProfit.totalOrdersSoldRevenue = ordersRevenue;
      dailyProfit.netProfit = netProfit;

      const savedProfit = await this.dailyProfitRepo.saveAsync(dailyProfit);

      this.log.info(
        `Daily profit calculated and saved for date: ${date.toISOString().split("T")[0]}`
      );
      return savedProfit;
    } catch (error) {
      this.log.error("Error calculating daily profit", error);
      throw error;
    }
  }

  private async calculateTotalSalaryExpenses(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<number> {
    try {
      // TODO: Implement staff payment calculation when StaffPaymentRepo is available
      // For now, return 0
      this.log.info(
        `Total salary expenses for period: 0 (not implemented yet)`
      );
      return 0;
    } catch (error) {
      this.log.error("Error calculating salary expenses", error);
      return 0;
    }
  }

  private async calculateTotalNormalExpenses(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<number> {
    try {
      const expenses = await this.expenseRepo.findAllAsync({
        where: {
          createdAt: Between(startOfDay, endOfDay),
          isDeleted: false,
        },
      });

      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + Number(expense.price || 0),
        0
      );
      this.log.info(`Total normal expenses for period: ${totalExpenses}`);
      return totalExpenses;
    } catch (error) {
      this.log.error("Error calculating normal expenses", error);
      return 0;
    }
  }

  private async calculateTotalSoldFishPrice(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<number> {
    try {
      // Get delivery items that have been sold (soldAmount > 0) within the date range
      const deliveryItems = await this.deliveryItemRepo
        .getRaw()
        .createQueryBuilder("di")
        .leftJoinAndSelect("di.delivery", "d")
        .where("d.deliveryDate >= :start", { start: startOfDay })
        .andWhere("d.deliveryDate <= :end", { end: endOfDay })
        .andWhere("d.isDeleted = :isDeleted", { isDeleted: false })
        .andWhere("di.isDeleted = :isDeleted", { isDeleted: false })
        .andWhere("di.soldAmount > 0")
        .getMany();

      const totalSoldPrice = deliveryItems.reduce((sum, item) => {
        return sum + Number(item.soldAmount) * Number(item.pricePerKilo);
      }, 0);

      this.log.info(`Total sold fish price for period: ${totalSoldPrice}`);
      return totalSoldPrice;
    } catch (error) {
      this.log.error("Error calculating sold fish price", error);
      return 0;
    }
  }

  private async calculateTotalOrdersRevenue(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<number> {
    try {
      const orders = await this.orderRepo.findActive({
        where: {
          createAt: Between(startOfDay, endOfDay),
        },
      });

      const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.totalPrice || 0),
        0
      );
      this.log.info(`Total orders revenue for period: ${totalRevenue}`);
      return totalRevenue;
    } catch (error) {
      this.log.error("Error calculating orders revenue", error);
      return 0;
    }
  }

  async getDailyProfitByDate(date: Date): Promise<DailyProfit | null> {
    try {
      const profits = await this.dailyProfitRepo.findAllAsync({
        where: {
          profitDate: date,
          isDeleted: false,
        },
      });

      return profits.length > 0 ? profits[0] : null;
    } catch (error) {
      this.log.error("Error getting daily profit by date", error);
      return null;
    }
  }

  async getDailyProfitsInRange(
    startDate: Date,
    endDate: Date
  ): Promise<DailyProfit[]> {
    try {
      return await this.dailyProfitRepo.findAllAsync({
        where: {
          profitDate: Between(startDate, endDate),
          isDeleted: false,
        },
        order: {
          profitDate: "DESC",
        },
      });
    } catch (error) {
      this.log.error("Error getting daily profits in range", error);
      return [];
    }
  }
}
