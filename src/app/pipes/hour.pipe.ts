import { Pipe, PipeTransform } from '@angular/core';
import { convertToDateStr } from '../config/dateStr';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'hour'
})
export class HourPipe implements PipeTransform {

  constructor (private datePipe: DatePipe) { }
  /**
   * @param hour txnHour record
   * @param busDate Date of the bus record
   * @param targetDate Date of the selected data to display
   * @returns time string to translate
   */
  transform(hour: number, busDate?: Date, targetDate?: string): string {
    const numHour = Number(hour);
    if ((busDate && convertToDateStr(new Date(busDate))) !== targetDate) {
      const datePipe = this.datePipe.transform(busDate, 'MMM d');
      return `${datePipe}, 12 AM`;
    }

    let timeString = '';
    switch (true) {
      case (numHour === 12):
        timeString = '12 PM';
        break;
      case (numHour < 12):
        timeString = `${hour} AM`;
        break;
      case (numHour > 12):
        timeString = `${hour - 12} PM`;
        break;
      default:
    }

    return timeString;
  }

}
