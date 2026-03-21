import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RippleModule } from 'primeng/ripple';
import { LandingPageEditorComponent } from './landing-page-editor/landing-page-editor.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { BlukUploadComponent } from "../../@shared/components/bluk-upload/bulk-upload.component";
import { InputNumberModule } from 'primeng/inputnumber';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'category',
    component: CategoryEditorComponent
  },
  {
    path: ':slug',
    component: LandingPageEditorComponent
  },
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AccordionModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    PaginatorModule,
    ReactiveFormsModule,
    SelectButtonModule,
    RippleModule,
    FileUploadModule,
    InputNumberModule,
    BlukUploadComponent
  ],
  declarations: [LandingPageComponent, LandingPageEditorComponent, CategoryEditorComponent]
})
export class LandingPageModule { }
