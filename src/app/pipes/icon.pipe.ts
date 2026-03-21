import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'icon',
    standalone: false
})
export class IconPipe implements PipeTransform {

  transform(value: string, args: string): string {
    return value + ' ' + args;
  }

}
