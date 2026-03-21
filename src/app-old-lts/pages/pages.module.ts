import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '@theme/theme.module';
import { StoreModule } from '@ngrx/store';
import {TableModule} from "primeng/table";
import {EffectsModule} from "@ngrx/effects";
import {pagesFeatureKey} from "./store/selectors";
import {pagereducer} from "./store/reducer";
import {PageEffects} from "./store/effects";
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import {SelectModule} from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { UserTrackingComponent } from './user-tracking/user-tracking.component';
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import { UniversityListComponent } from './course-list/university-list/university-list.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { UnifinderSubjectComponent } from './course-list/unifinder-subject/unifinder-subject.component';
import { AuthService } from '../Auth/auth.service';
import { AdvisorChatComponent } from './advisor-chat/advisor-chat.component';
import {TabsModule} from 'primeng/tabs';
import { EditorModule } from "primeng/editor";
import { AddPoliticianInsightsComponent } from './add-politician-insights/add-politician-insights.component';
import { AddGovernmentFundingComponent } from './founderstool/add-government-funding/add-government-funding.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PromptEditorComponent } from './prompt-editor/prompt-editor.component';
import { ConfirmationService } from 'primeng/api';
import { OurManagementsComponent } from './our-managements/our-managements.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        PagesComponent,
        UserTrackingComponent,
        UniversityListComponent,
        UnifinderSubjectComponent,
        AdvisorChatComponent,
        AddPoliticianInsightsComponent,
        AddGovernmentFundingComponent,
        PromptEditorComponent,
      ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ThemeModule,
        MultiSelectModule,
        FormsModule,
        AccordionModule,
        TableModule,
        SelectModule,
        StoreModule.forFeature(pagesFeatureKey, pagereducer),
        EffectsModule.forFeature([PageEffects]),
        DatePickerModule,
        PaginatorModule,
        ReactiveFormsModule,
        InputTextModule,
        ScrollTopModule,
        TabsModule,
        EditorModule,
        ConfirmPopupModule,
        ButtonModule,
    ],
    providers:[AuthService,ConfirmationService]
})
export class PagesModule { }
