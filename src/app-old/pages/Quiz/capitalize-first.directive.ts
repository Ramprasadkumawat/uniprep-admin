import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[uniCapitalizeFirst]',
    standalone: false
})
export class CapitalizeFirstDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = this.el.nativeElement.value;
    this.el.nativeElement.value = this.capitalizeSentence(input);
  }

  private capitalizeSentence(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
