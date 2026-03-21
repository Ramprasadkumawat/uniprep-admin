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
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { AddContributionsComponent } from './add-contributions/add-contributions.component';
import { AvatarModule } from 'primeng/avatar';
import { ContributorsListComponent } from './contributors-list/contributors-list.component';
import { TableModule } from 'primeng/table';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ContributionsDetailsComponent } from './add-contributions/contributions-details/contributions-details.component';
import { TabsModule } from 'primeng/tabs';
import { CollegeListComponent } from './college-list/college-list.component';
import { DialogModule } from 'primeng/dialog';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CollegeDetailsComponent } from './college-list/college-details/college-details.component';
import { ContributorsEventsComponent } from './contributors-events/contributors-events.component';
import { EventDetailsComponent } from './contributors-events/event-details/event-details.component';

const routes: Routes = [
    {
        path: '',
        component: AddContributionsComponent
    },
    {
        path: 'college',
        component: CollegeListComponent
    },
    {
        path: 'college/:id',
        component: CollegeDetailsComponent
    },
    {
        path: 'list',
        component: ContributorsListComponent
    },
    {
        path: 'events',
        component: ContributorsEventsComponent
    },
    {
        path: 'events/:id',
        component: EventDetailsComponent
    },
    {
        path: ':id',
        component: ContributionsDetailsComponent
    }
    
]
@NgModule({
    declarations: [
        AddContributionsComponent,
        ContributorsListComponent,
        ContributionsDetailsComponent,
        CollegeListComponent,
        CollegeDetailsComponent,
        ContributorsEventsComponent,
        EventDetailsComponent
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
        InputTextModule,
        AvatarModule,
        TableModule,
        ScrollTopModule,
        TabsModule,
        DialogModule,
        NgxIntlTelInputModule
    ],
    providers: [ConfirmationService]
})
export class ContributionsProgramModule { } 
