import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPipe } from './icon.pipe';
import {CountryImagePipe} from "@pipes/country-image.pipe";
import {SafePipe} from "@pipes/safe.pipe";



@NgModule({
  declarations: [IconPipe, CountryImagePipe, SafePipe],
  imports: [
    CommonModule
  ],
  exports: [IconPipe, CountryImagePipe, SafePipe]
})
export class PipesModule { }
