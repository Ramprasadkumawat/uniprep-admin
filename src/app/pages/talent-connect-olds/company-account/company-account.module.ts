import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyAccountComponent } from './company-account.component';
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
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CompanyTalentProfilesComponent } from './company-talent-profiles/company-talent-profiles.component';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
const routes: Routes = [
  {
    path: 'jobs',
    loadChildren: () => import('./company-jobs/company-jobs.module').then(m => m.CompanyJobsModule),
  },
  {
    path: 'talents',
    component: CompanyTalentProfilesComponent
  },
  {
    path: '',
    component: CompanyAccountComponent
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
    DatePickerModule,
    MultiSelectModule
  ],
  declarations: [CompanyAccountComponent, CompanyTalentProfilesComponent  ]
})
export class CompanyAccountModule { }
