import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputTextModule} from "primeng/inputtext";
import {SelectModule} from "primeng/select";
import {PasswordModule} from "primeng/password";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import {CheckboxModule} from "primeng/checkbox";
import {authFeatureKey} from "./store/selectors";
import {authReducer} from "./store/reducer";
import {AuthEffects} from "./store/effects";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerificationComponent } from './verification/verification.component';
@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SetpasswordComponent,
    VerificationComponent
  ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AuthRoutingModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        MultiSelectModule,
        PasswordModule,
        ToastModule,
        CheckboxModule,
        StoreModule.forFeature(authFeatureKey, authReducer),
        EffectsModule.forFeature([AuthEffects]),
        FormsModule
        
    ],
    providers: [MessageService]
})
export class AuthModule { }
