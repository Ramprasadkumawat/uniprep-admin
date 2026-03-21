import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss'],
    standalone: false
})
export class VerificationComponent implements OnInit {
  @ViewChild('otp1') otp1!: ElementRef;
  @ViewChild('otp2') otp2!: ElementRef;
  @ViewChild('otp3') otp3!: ElementRef;
  @ViewChild('otp4') otp4!: ElementRef;
  public otpForm: any = FormGroup;
  constructor(private service: AuthService, private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,private toastr: MessageService) {}
  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp1: ["", [Validators.required]],
      otp2: ["", [Validators.required]],
      otp3: ["", [Validators.required]],
      otp4: ["", [Validators.required]],
    });

    if (this.route.snapshot.paramMap.get("email") == null) {
      this.router.navigate(['/forgot-password']);
    }
  }
  submitted = false;
  get f() {
    return this.otpForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.otpForm.invalid) {
      return;
    }
    let _otp=this.otpForm.value.otp1+this.otpForm.value.otp2+this.otpForm.value.otp3+this.otpForm.value.otp4;

    const data = {
      otp: _otp,
      email: this.route.snapshot.paramMap.get("email"),
    };
    this.service.validateEmailOTP(data).subscribe(
        (res: any) => {
          this.router.navigate(["/auth/setpassword",_otp,this.route.snapshot.paramMap.get("email")]);
        },
        (error: any) => {

        }
    );
  }
  resend(){
    let val = {
      email: this.route.snapshot.paramMap.get("email"),
    };
    this.service.getOTP(val).subscribe(
      (res: any) => {
        this.toastr.add({severity:'success', summary: 'Success', detail: "OTP Generated and Sent to " + val.email});
      },
      (error: any) => {
        this.toastr.add({severity:'warning', summary: 'Sorry :(', detail: error});
      }
    );
  }

  focusNextInput(event: any, num: number) {
    const code = (event.code || '').toLowerCase();

    if (code.includes('backspace')) {
      switch (num) {
        case 2:
          this.otp1.nativeElement.focus();
          break;
        case 3:
          this.otp2.nativeElement.focus();
          break;
        case 4:
          this.otp3.nativeElement.focus();
          break;
      }
    } else if (code.includes('digit')) {
      switch (num) {
        case 1:
          this.otp2.nativeElement.focus();
          break;
        case 2:
          this.otp3.nativeElement.focus();
          break;
        case 3:
          this.otp4.nativeElement.focus();
          break;
      }
    }
  }
}
