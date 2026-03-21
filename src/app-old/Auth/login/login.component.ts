import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import {MessageService} from "primeng/api";
import {SubSink} from "subsink";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  loginForm: any = FormGroup;
  submitted = false;
  password: any;
  show = false;
  userdetails:any;
  constructor(
      private service: AuthService, private formBuilder: FormBuilder,private route:Router,
      private toastr: MessageService
  ) {}

  darkModeSwitch!: HTMLInputElement;

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.subs.sink = this.service.selectloggedIn$().subscribe(loggedIn => {
      if (!loggedIn) {
        return
      }
      this.service.getMe().subscribe((res) => {
          this.userdetails = res
          if(this.userdetails.userdetails[0].usertype_id != 3 ){
            this.route.navigate(['/userdashboard']);
          }else{
            this.route.navigate(['/review/dashboard']);
          }
          if(this.userdetails) {
            this.subs.sink = this.service.selectMessage$().subscribe(message => {
              if (message) {
                this.toastr.add({severity: 'success', summary: 'Success', detail: message});
              }
            });
          }
      }); 
      // this.route.navigate(['/dashboard']);
    });

    this.password = 'password';

    this.darkModeSwitch = document.getElementById('darkmodeswitch') as HTMLInputElement;
  
    // Read the theme and checked state from the cookie and apply them to the body class and the switch
    const theme = this.getCookie('theme');
    if (theme === 'dark') {
      document.body.classList.add('darkmode');
      this.darkModeSwitch.checked = true;
    } else {
      document.body.classList.add('lightmode');
      this.darkModeSwitch.checked = false;
    }
  
    const checked = this.getCookie('checked');
    if (checked === 'true') {
      this.darkModeSwitch.checked = true;
    } else if (checked === 'false') {
      this.darkModeSwitch.checked = false;
    }
  
    // Add event listener to toggle the theme and save it in a cookie
    this.darkModeSwitch.addEventListener('change', () => {
      if (this.darkModeSwitch.checked) {
        document.body.classList.remove('lightmode');
        document.body.classList.add('darkmode');
        this.setCookie('theme', 'dark');
        this.setCookie('checked', 'true');
      } else {
        document.body.classList.remove('darkmode');
        document.body.classList.add('lightmode');
        this.setCookie('theme', 'light');
        this.setCookie('checked', 'false');
      }
    });
    
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.service.login(this.loginForm.value);
  }
  showPassword(){
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  private setCookie(name: string, value: string, days: number = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : '';
  }
}
