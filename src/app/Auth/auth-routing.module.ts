import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RedirectGuard } from './redirect.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerificationComponent } from './verification/verification.component';

const Auhtroutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        // canActivate: [RedirectGuard]
      },
     { path: '', redirectTo: 'login', pathMatch: 'full' },
     {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'setpassword/:otp/:email',
        component: SetpasswordComponent,
      },
      {
        path: 'verification/:email',
        component: VerificationComponent,
      },
    ],

  },
  
];

@NgModule({
  imports: [RouterModule.forChild(Auhtroutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
