import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageFacadeService } from '../page-facade.service';
import { AccordionModule } from 'primeng/accordion';
import {SelectModule} from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MyprofileService } from './myprofile.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { MessageService } from 'primeng/api';
import { CustomValidators } from 'src/app/@Supports/validator';
import { filter } from 'rxjs';

@Component({
    selector: 'uni-myprofile',
    imports: [CommonModule, InputTextModule, CardModule, ReactiveFormsModule, AccordionModule, SelectModule,
        ButtonModule],
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {

  form: FormGroup;
  userTypes: any = [];
  submitted: boolean = false;
  passwordForm: FormGroup;
  passwordFormSubmitted: boolean = false;
  userdetail: any = [];
  btnLabel: string = 'Edit Profile';
  showEdit: boolean = false;
  pshow: any = false;
  pass: any = "password";
  pshowc: boolean = false;
  passc: string = "password";
  pshowo: boolean = false;
  passo: string = "password";
  constructor(private pageService: PageFacadeService, private fb: FormBuilder,
    private profileService: MyprofileService, private authService: AuthService,
    private toaster: MessageService) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      userType: ['', [Validators.required]],
    });
    this.passwordForm = fb.group({
      password: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      passwordConfirmation: ['', [Validators.required]],
    },
      {
        validators: CustomValidators.mustMatch('newpassword', 'passwordConfirmation') // Use the custom validator
      })
  }

  ngOnInit(): void {
    this.getUser();
    this.getUsertypes();
  }

  get f() {
    return this.form.controls;
  }
  get pf() {
    return this.passwordForm.controls;
  }

  getUser() {
    this.authService.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        this.userdetail = res;
        if (this.userdetail.length > 0) {
          this.form.patchValue({
            name: this.userdetail[0].name,
            email: this.userdetail[0].email,
            phone: this.userdetail[0].phone,
            userId: this.userdetail[0].user_id,
            userType: this.userdetail[0].usertype_id
          });
        }
      });
  }

  getUsertypes() {
    this.pageService.getUserTypes().subscribe(response => {
      this.userTypes = response.data;
    });
  }

  submitForm() {
    if (this.btnLabel == 'Edit Profile') {
      this.btnLabel = 'Update Profile';
      this.showEdit = true;
    }
    else {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      this.profileService.updateProfile({ name: this.form.value.name }).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.btnLabel = 'Edit Profile';
        this.showEdit = false;
        this.getUser();
      });
    }

  }

  submitPasswordForm() {
    this.passwordFormSubmitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.profileService.updatePassword({ ...this.passwordForm.value, email: this.userdetail[0].email }).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.authService.logout()
    });
  }

  ShowPassword() {
    if (this.pshow == true) {
      this.pshow = false;
      this.pass = "password";
    } else {
      this.pshow = true;
      this.pass = "text";
    }
  }

  ShowPasswordOld() {
    if (this.pshowo == true) {
      this.pshowo = false;
      this.passo = "password";
    } else {
      this.pshowo = true;
      this.passo = "text";
    }
  }

  ShowPasswordConfirm() {
    if (this.pshowc == true) {
      this.pshowc = false;
      this.passc = "password";
    } else {
      this.pshowc = true;
      this.passc = "text";
    }
  }


}
