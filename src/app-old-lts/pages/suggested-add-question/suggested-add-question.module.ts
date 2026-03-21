import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SuggestedAddQuestionRoutingModule } from "./suggested-add-question-routing.module";
import { InputTextModule } from "primeng/inputtext";
import { TabsModule } from "primeng/tabs";
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { ReactiveFormsModule } from "@angular/forms";
import { ReadingRoutingModule } from "../reading/reading-routing.module";
import { PaginatorModule } from "primeng/paginator";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { EditorModule } from "primeng/editor";
import { RatingModule } from "primeng/rating";
import { CarouselModule } from "primeng/carousel";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { PanelModule } from "primeng/panel";
import { CheckboxModule } from "primeng/checkbox";
import { BadgeModule } from "primeng/badge";
import { SuggestedAddQuestionComponent } from "./suggested-add-question.component";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [SuggestedAddQuestionComponent],
	imports: [CommonModule, SuggestedAddQuestionRoutingModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, TextareaModule, ReactiveFormsModule, FormsModule, ReadingRoutingModule, PaginatorModule, CardModule, TagModule, DatePickerModule, DialogModule, EditorModule, RatingModule, CarouselModule, ConfirmPopupModule, PanelModule, BadgeModule, CheckboxModule],
})
export class SuggestedAddQuestionModule {}
