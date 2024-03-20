import { Pipe, PipeTransform } from '@angular/core';
import { numberFormat } from '../config/numberFormat';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(num?: number): string {
    return numberFormat(num);
  }

}
