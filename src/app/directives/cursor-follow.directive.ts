import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCursorFollow]'
})
export class CursorFollowDirective {

  constructor (private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    let x = event.clientX;
    let y = event.clientY;

    if (y > window.scrollY - 20) y -= 150;
    if (x > window.innerWidth - 200) x -= 450;

    this.renderer.setStyle(this.el.nativeElement, 'left', `${x}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${y}px`);
  }
}
