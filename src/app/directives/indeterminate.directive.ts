import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[indeterminate]'
})
export class IndeterminateDirective {
  constructor (private elem: ElementRef) { }

  @Input() set indeterminate(value: boolean) {
    this.elem.nativeElement.indeterminate = value;
  }

}
