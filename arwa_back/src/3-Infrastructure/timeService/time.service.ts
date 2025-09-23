import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  getCurrentDate() {
    return new Date();
  }

  getDateBeforeNow(days: number, hours = 0, minutes = 0) {
    return new Date(
      new Date().getTime() -
        days * 24 * 60 * 60 * 1000 -
        hours * 60 * 60 * 1000 -
        minutes * 60 * 1000,
    );
  }

  getDateAfterNow(days: number, hours = 0, minutes = 0) {
    return new Date(
      new Date().getTime() +
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000,
    );
  }

  getApiCurrentDate() {
    const currentDate = new Date();
    const currentDateAsString = currentDate.toISOString().slice(0, 10); // Get YYYY-MM-DD format
    return currentDateAsString;
  }

  getApiDateAfterOneWeek() {
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    const oneWeekLaterAsString = oneWeekLater.toISOString().slice(0, 10);
    return oneWeekLaterAsString;
  }

  getCurrentSeason() {
    if (new Date().getUTCMonth() < 7) {
      return new Date().getFullYear() - 1;
    }
    return new Date().getFullYear();
  }

  getClearDate() {
    return this.getDateBeforeNow(1);
  }
}
