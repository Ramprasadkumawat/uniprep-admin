import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyListRoutingModule } from './company-list-routing.module';
import { CompanyListComponent } from './company-list.component';
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {SelectModule} from "primeng/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";


@NgModule({
  declarations: [
    CompanyListComponent
  ],
  imports: [
    CommonModule,
    CompanyListRoutingModule,
    AccordionModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule
  ]
})
export class CompanyListModule { }
