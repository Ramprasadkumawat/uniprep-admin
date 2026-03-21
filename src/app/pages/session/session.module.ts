import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import {SelectModule} from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import {TextareaModule} from 'primeng/textarea';
import { SessionmanagerComponent } from './sessionmanager/sessionmanager.component';
import { SessionfeedbackformComponent } from './sessionfeedbackform/sessionfeedbackform.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    SessionComponent,
    // SessionmanagerComponent,
    SessionfeedbackformComponent,
  ],
  imports: [
    CommonModule,
    // SessionRoutingModule,
    ReactiveFormsModule,
    PaginatorModule,
    ConfirmPopupModule,
    ButtonModule,
    RouterModule,
    SelectModule,
    CheckboxModule,
    TextareaModule
  ],
  providers: [ConfirmationService]
})
export class SessionModule { }
  