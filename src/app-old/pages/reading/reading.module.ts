import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ReadingRoutingModule } from "./reading-routing.module";
import { ReadingComponent } from "./reading.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TabsModule } from "primeng/tabs";
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { PreApplicationComponent } from "./pre-application/pre-application.component";
import { PostApplicationComponent } from "./post-application/post-application.component";
import { PostAdmissionComponent } from "./post-admission/post-admission.component";
import { UniversityComponent } from "./university/university.component";
import { CareerHubComponent } from "./career-hub/career-hub.component";
import { LifeAtCountryComponent } from "./life-at-country/life-at-country.component";
import { PaginatorModule } from "primeng/paginator";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { EditorModule } from "primeng/editor";
import { RatingModule } from "primeng/rating";
import { CarouselModule } from "primeng/carousel";
import { ConfirmationService } from "primeng/api";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { QuestionsComponent } from "./questions/questions.component";
import { SuggestedQuestionComponent } from "./suggested-question/suggested-question.component";
import { PanelModule } from "primeng/panel";
import { BadgeModule } from "primeng/badge";
import { PipesModule } from "@pipes/pipes.module";
import { MultiSelectModule } from "primeng/multiselect";
import { QAndASummaryComponent } from "../q-and-asummary/q-and-asummary.component";
import { QAndACategorysummaryComponent } from "../q-and-a-categorysummary/q-and-a-categorysummary.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { GenralreportComponent } from "../genralreport/genralreport.component";
import { ScrollTopModule } from "primeng/scrolltop";
import { TravelAndTourismComponent } from "./travel-and-tourism/travel-and-tourism.component";
import { PitchDeskComponent } from "../pitch-desk/pitch-desk.component";
import { FileUploadModule } from "primeng/fileupload";
import { CareerPlannerComponent } from "../career-planner/career-planner.component";
import { LearningHubComponent } from "./learning-hub/learning-hub.component";
import { LearningSubCategoryComponent } from "./learning-sub-category/learning-sub-category.component";
import { LearningHubQuestionsComponent } from "./learning-hub-questions/learning-hub-questions.component";
import { JobSitesComponent } from "../career-planner/job-sites/job-sites.component";
import { SkillMasteryComponent } from "./skill-mastery/skill-mastery.component";
import { CourseListComponent } from "../course-list/course-list.component";
import { K12CategoryComponent } from "./k12-category/k12-category.component";
import { K12Component } from "./k12/k12.component";
import { K12ClassComponent } from "./k12-class/k12-class.component";
import { K12SubjectComponent } from "./k12-subject/k12-subject.component";
import { K12ChapterComponent } from "./k12-chapter/k12-chapter.component";
import { K12BoardComponent } from "./k12-board/k12-board.component";
import { K12StateComponent } from "./k12-state/k12-state.component";

@NgModule({
	declarations: [ReadingComponent, SubCategoryComponent, PreApplicationComponent, PostApplicationComponent, PostAdmissionComponent, UniversityComponent, CareerHubComponent, LifeAtCountryComponent, QuestionsComponent, SuggestedQuestionComponent, QAndASummaryComponent, QAndACategorysummaryComponent, GenralreportComponent, TravelAndTourismComponent, PitchDeskComponent, CareerPlannerComponent, LearningHubComponent, LearningSubCategoryComponent, LearningHubQuestionsComponent, JobSitesComponent, SkillMasteryComponent, CourseListComponent, K12CategoryComponent, K12Component, K12ClassComponent, K12SubjectComponent, K12ChapterComponent, K12BoardComponent, K12StateComponent],
	imports: [CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, ButtonModule, TextareaModule, ReactiveFormsModule, ReadingRoutingModule, PaginatorModule, CardModule, TagModule, DatePickerModule, DialogModule, EditorModule, RatingModule, CarouselModule, ConfirmPopupModule, PanelModule, BadgeModule, PipesModule, MultiSelectModule, CKEditorModule, ScrollTopModule, FileUploadModule, FormsModule],
	providers: [ConfirmationService],
})
export class ReadingModule {}
