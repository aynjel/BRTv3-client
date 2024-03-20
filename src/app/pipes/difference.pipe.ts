import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difference'
})
export class DifferencePipe implements PipeTransform {

  transform(value: '', cashCount: number, netAmt: number): string {
    const difference = cashCount - netAmt;
    let status = '';

    if (difference < -1) status = '(Short)';
    else if (difference > 1) status = '(Excess)';
    else status = '';

    return status;
  }
}
