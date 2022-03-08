import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appBreakinhtml]'
})
export class BreakinhtmlDirective {


  constructor(private  eref: ElementRef) {


   }

   @HostListener('mouseenter')onMouseEnter(){
    this.eref.nativeElement.style.backgroundColor = "yellow";
   }

   @HostListener('mouseleave')mouseleave(){
    this.eref.nativeElement.style.backgroundColor = null;
   }



}
