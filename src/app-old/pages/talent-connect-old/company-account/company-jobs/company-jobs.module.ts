import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyJobsComponent } from './company-jobs.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { CompanyAccountComponent } from '../company-account.component';
import { JobApplyProfilesComponent } from './job-apply-profiles/job-apply-profiles.component';
const routes: Routes = [
  {
    path: 'openjobs',
    component: CompanyJobsComponent
  },
  {
    path: 'profile',
    component: JobApplyProfilesComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    AccordionModule,
    ScrollTopModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    ProgressBarModule,
    CardModule,
    InputTextModule,
    SelectButtonModule,
    CheckboxModule,
    PaginatorModule,
  ],
  declarations: [CompanyJobsComponent,JobApplyProfilesComponent]
})
export class CompanyJobsModule { }
