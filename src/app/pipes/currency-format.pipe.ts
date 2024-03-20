import { Pipe, PipeTransform } from '@angular/core';
import { currencyFormat } from '../config/currencyFormat';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(num?: number): string {
    return currencyFormat(num);
  }
}
