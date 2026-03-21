import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestorRoutingModule } from './investor-routing.module';
import { InvestorComponent } from './investor.component';
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SelectModule} from "primeng/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [
    InvestorComponent
  ],
    imports: [
        CommonModule,
        InvestorRoutingModule,
        AccordionModule,
        ButtonModule,
        ConfirmDialogModule,
        SelectModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MultiSelectModule,
        DialogModule
    ]
})
export class InvestorModule { }
