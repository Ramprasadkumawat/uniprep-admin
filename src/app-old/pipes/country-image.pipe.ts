import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countryImage',
    standalone: false
})
export class CountryImagePipe implements PipeTransform {

  transform(name: string): string {
    return "/assets/icons/" + name.replace(/\s/g, "").trim() + ".png";
  }

}
