import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddRequirementComponent } from "./add-requirement/add-requirement.component";
import { ViewRequirementComponent } from "./view-requirement/view-requirement.component";
import { ViewOrderComponent } from "./view-order/view-order.component";
import { RequirementTalentsComponent } from "./talents/talents.component";
import { DeliveredTalentsComponent } from "./delivered-talents/delivered-talents.component";
import { DeliveredTalentsListComponent } from "./delivered-talents-list/delivered-talents-list.component";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { TooltipModule } from "primeng/tooltip";
import { TextareaModule } from "primeng/textarea";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from "primeng/select";
import { CheckboxModule } from "primeng/checkbox";
import { SignaturePadComponent } from "./add-requirement/signature-pad.component";
import { ChipModule } from "primeng/chip";
import { MultiSelectModule } from "primeng/multiselect";
import { EditorModule } from "primeng/editor";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { ProgressBarModule } from "primeng/progressbar";
import { SelectButtonModule } from "primeng/selectbutton";
import { ScrollTopModule } from "primeng/scrolltop";
import { PopoverModule } from "primeng/popover";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { InputGroupModule } from "primeng/inputgroup";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";

const routes: Routes = [
  {
    path: "add-requirement",
    component: AddRequirementComponent,
  },
  {
    path: "view-requirement",
    component: ViewRequirementComponent,
  },
  {
    path: "view-order",
    component: ViewOrderComponent,
  },
  {
    path: "talents",
    component: RequirementTalentsComponent,
  },
  {
    path: "delivered-talents-list",
    component: DeliveredTalentsListComponent,
  },
  {
    path: "delivered-talents/add",
    component: DeliveredTalentsComponent,
  },
  {
    path: "",
    redirectTo: "add-requirement",
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [
    AddRequirementComponent,
    ViewRequirementComponent,
    ViewOrderComponent,
    RequirementTalentsComponent,
    DeliveredTalentsComponent,
    DeliveredTalentsListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    DatePickerModule,
    TooltipModule,
    TextareaModule,
    DialogModule,
    SelectModule,
    CheckboxModule,
    ChipModule,
    SignaturePadComponent,
    MultiSelectModule,
    EditorModule,
    DatePickerModule,
    InputNumberModule,
    ProgressBarModule,
    SelectButtonModule,
    ScrollTopModule,
    PopoverModule,
    ConfirmPopupModule,
    InputGroupModule,
    TagModule,
    ToastModule,
    NgxIntlTelInputModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class RequirementModule {}
