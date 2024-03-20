import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoricalCalendarService {
  readonly months = [
    { name: 'January', number: 1 },
    { name: 'February', number: 2 },
    { name: 'March', number: 3 },
    { name: 'April', number: 4 },
    { name: 'May', number: 5 },
    { name: 'June', number: 6 },
    { name: 'July', number: 7 },
    { name: 'August', number: 8 },
    { name: 'September', number: 9 },
    { name: 'October', number: 10 },
    { name: 'November', number: 11 },
    { name: 'December', number: 12 },
  ];

  readonly days = [
    { name: 'Sunday', number: 0 },
    { name: 'Monday', number: 1 },
    { name: 'Tuesday', number: 2 },
    { name: 'Wednesday', number: 3 },
    { name: 'Thursday', number: 4 },
    { name: 'Friday', number: 5 },
    { name: 'Saturday', number: 6 },
  ];

  constructor() {}

  arrangeDays(firstDay: number, daysInMonth: number): number[] {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  getMonthNames(): string[] {
    return this.months.map(month => month.name);
  }

  getDayNames(): string[] {
    return this.days.map(day => day.name);
  }

  getMonthName(monthNumber: number): string {
    return this.months[monthNumber - 1].name;
  }

  getDayName(dayNumber: number): string {
    return this.days[dayNumber].name;
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month - 1, 1).getDay();
  }

  getLastDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDay();
  }
}
