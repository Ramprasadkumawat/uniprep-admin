import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LanguageHubRoutingModule } from './language-hub-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import {SelectModule} from 'primeng/select';
import {TextareaModule} from 'primeng/textarea';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReadingRoutingModule } from '../reading/reading-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { PipesModule } from '@pipes/pipes.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FileUploadModule } from 'primeng/fileupload';
import { LanguageHubComponent } from './language-hub/language-hub.component';
import { LanguageHubSubcategoryComponent } from './language-hub-subcategory/language-hub-subcategory.component';
import { LanguageHubSubmoduleComponent } from './language-hub-submodule/language-hub-submodule.component';
import { LanguageHubQuestionsComponent } from './language-hub-questions/language-hub-questions.component';
import { ConfirmationService } from 'primeng/api';
import { LanguageComponent } from './language/language.component';
import { PvlComponent } from './pvl/pvl.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';


@NgModule({
  declarations: [
    LanguageHubComponent,
    LanguageHubSubcategoryComponent,
    LanguageHubSubmoduleComponent,
    LanguageHubQuestionsComponent,
    LanguageComponent,
    PvlComponent,
    VocabularyComponent,
  ],
  imports: [
    CommonModule,
    LanguageHubRoutingModule,
    InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,ButtonModule,
    TextareaModule,ReactiveFormsModule, ReadingRoutingModule, PaginatorModule, CardModule, FormsModule,
    TagModule, DatePickerModule, DialogModule, EditorModule, RatingModule, CarouselModule, ConfirmPopupModule,
    PanelModule, BadgeModule, PipesModule,MultiSelectModule, CKEditorModule,ScrollTopModule, FileUploadModule,
  ],
  providers:[ConfirmationService]
})
export class LanguageHubModule { }
