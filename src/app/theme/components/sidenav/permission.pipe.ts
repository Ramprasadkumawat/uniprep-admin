import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permission',
  standalone: true
})
export class PermissionPipe implements PipeTransform {

  transform(required: string[], userPermission: string[]): boolean {
    const output = required.filter(function (obj) {
      return userPermission.indexOf(obj) !== -1;
    });
    return output.length > 0;
  }

}
