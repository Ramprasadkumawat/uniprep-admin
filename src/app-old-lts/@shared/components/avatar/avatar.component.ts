import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';

@Component({
    selector: 'uni-avatar',
    template: '',
    styleUrls: ['./avatar.component.scss'],
    standalone: false
})
export class AvatarComponent {

  @HostBinding('style.background-image') private _src: string = '';
  @Input() set src(source: string) {
    this._src = `url(${source})`;
  }
}
