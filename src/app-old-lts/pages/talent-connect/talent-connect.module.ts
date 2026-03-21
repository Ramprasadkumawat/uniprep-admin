import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyCompanyAccountComponent } from './verify-company-account/verify-company-account.component';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { JobsComponent } from './jobs/jobs.component';
import { TalentsComponent } from './talents/talents.component';
import { RatingModule } from 'primeng/rating';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppliedProfilesComponent } from './jobs/applied-profiles/applied-profiles.component';
import { PaginatorModule } from 'primeng/paginator';
import { TextareaModule } from 'primeng/textarea';
import { AppliedCompaniesComponent } from './talents/applied-companies/applied-companies.component';
import { AppliedJobsComponent } from './talents/applied-jobs/applied-jobs.component';
import { DatePickerModule } from 'primeng/datepicker';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PopoverModule } from 'primeng/popover';
import { FluidModule } from 'primeng/fluid';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

const routes: Routes = [
  {
    path: 'verify-account',
    component: VerifyCompanyAccountComponent,
  },
  {
    path: '',
    redirectTo: 'verify-account',
    pathMatch: 'full'
  },
  {
    path: 'company',
    loadChildren: () => import('./company-account/company-account.module').then(m => m.CompanyAccountModule),
  },
  {
    path: 'jobs',
    component: JobsComponent,
  },
  {
    path: 'jobs/:id',
    component: AppliedProfilesComponent
  },
  {
    path: 'talents',
    component: TalentsComponent,
  },
  {
    path: 'talents/company/:id',
    component: AppliedCompaniesComponent,
  },
  {
    path: 'talents/jobs/:id',
    component: AppliedJobsComponent,
  },
];

@NgModule({
  declarations: [
    VerifyCompanyAccountComponent,
    JobsComponent,
    TalentsComponent,
    AppliedProfilesComponent,
    AppliedCompaniesComponent,
    AppliedJobsComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    FluidModule,
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
    RatingModule,
    TextareaModule,
    NgxIntlTelInputModule,
    MultiSelectModule,
    PaginatorModule,
    TextareaModule,
    DatePickerModule,
    PopoverModule,
    ConfirmPopupModule
  ],
  providers: [ConfirmationService]

})
export class TalentConnectModule { }
