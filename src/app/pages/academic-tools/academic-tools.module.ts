import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicToolsRoutingModule } from './academic-tools-routing.module';
import { AcademicToolsComponent } from './academic-tools.component';
import { AcademicToolsCategoryComponent } from './academic-tools-category/academic-tools-category.component';
import { AcademicToolsQuizComponent } from './academic-tools-quiz/academic-tools-quiz.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import {SelectModule} from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import {TextareaModule} from 'primeng/textarea';
import { AcademictToolsListComponent } from './academict-tools-list/academict-tools-list.component';

@NgModule({
  declarations: [
    AcademicToolsComponent,
    AcademicToolsCategoryComponent,
    AcademicToolsQuizComponent,
    AcademictToolsListComponent
  ],
  imports: [
    CommonModule,
    AcademicToolsRoutingModule,
    ReactiveFormsModule,
    PaginatorModule,
    ConfirmPopupModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    TextareaModule,
    FormsModule
  ],
  providers: [ConfirmationService]
})
export class AcademicToolsModule { }
  