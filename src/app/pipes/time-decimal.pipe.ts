import { Pipe, PipeTransform } from '@angular/core';
import { convertToTimeDecimal } from '../config/timeDecimal';

@Pipe({
  name: 'timeDecimal'
})
export class TimeDecimalPipe implements PipeTransform {

  transform(time?: number): unknown {
    return convertToTimeDecimal(time);
  }
}
