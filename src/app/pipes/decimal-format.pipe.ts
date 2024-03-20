import { Pipe, PipeTransform } from '@angular/core';
import { decimalFormat } from '../config/decimalFormat';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {

  transform(num?: number): string {
    return decimalFormat(num);
  }

}
