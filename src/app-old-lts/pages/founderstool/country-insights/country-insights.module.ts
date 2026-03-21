import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import {SelectModule} from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import {TextareaModule} from 'primeng/textarea';
import { CountryInsightsComponent } from './country-insights.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddCountryInsightsQuestionsComponent } from './add-country-insights-questions/add-country-insights-questions.component';
import { MessageModule } from 'primeng/message';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
const routes: Routes = [
    {
        path: '',
        component: CountryInsightsComponent
    },
    {
        path: ':id',
        component: AddCountryInsightsQuestionsComponent
    }
]
@NgModule({
    declarations: [
        CountryInsightsComponent,
        AddCountryInsightsQuestionsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PaginatorModule,
        ConfirmPopupModule,
        ButtonModule,
        SelectModule,
        CheckboxModule,
        TextareaModule,
        RouterModule,
        AccordionModule,
        MultiSelectModule,
        RouterModule.forChild(routes),
        MessageModule,
        EditorModule,
        InputTextModule
    ],
    providers: [ConfirmationService]
})
export class CountryInsightsModule { } 
