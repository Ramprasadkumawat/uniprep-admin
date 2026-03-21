import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../../Auth/auth.service";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { HeaderService } from "./header.service";
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { filter } from "rxjs";


@Component({
    selector: "uni-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})

// interface Country{
//   name: string,
//   id: number
// }

export class HeaderComponent {
  @Input() breadcrumb: MenuItem[] = [
    { label: "Categories" },
    { label: "Sports" },
  ];
  @Input() expandicon = "";
  @Output() togleSidebar = new EventEmitter();
  @Output() logout = new EventEmitter();
  darkModeSwitch!: HTMLInputElement;
  countries: any;
  selectedCountry: any;
  email: any = ''
  name: any = ''
  firstletter: any = ''
  usertypename: any = ''
  usertype: boolean;
  headCountry: number;
  headForm: any;
  sv: {};

  constructor(private service: HeaderService, private authservice: AuthService, private formbuilder: FormBuilder) {

    this.headForm = this.formbuilder.group({
      country: ['', Validators.required],
    })

  }


  ngOnInit() {
    this.getuserdetails()
    this.getCountries();

    // alert(localStorage.getItem('headCountry'));
    this.headForm.patchValue({
      country: localStorage.getItem('headCountry'),
    });

    this.darkModeSwitch = document.getElementById('darkmodeswitch') as HTMLInputElement;

    // Read the theme and checked state from the cookie and apply them to the body class and the switch
    const theme = this.getCookie('theme');
    if (theme === 'dark') {
      document.body.classList.add('darkmode');
      if (this.darkModeSwitch) {
        this.darkModeSwitch.checked = true;
      }
    } else {
      document.body.classList.add('lightmode');
      if (this.darkModeSwitch) {
        this.darkModeSwitch.checked = false;
      }
    }

    const checked = this.getCookie('checked');
    if (this.darkModeSwitch) {
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

  }

  selectCountryy(event: any) {
    this.selectedCountry = event.value
    localStorage.setItem('headCountry', event.value.id);
    //  this.sv = {
    //     id : event.value.id,
    //     country : event.value.country,
    //     flag: event.value.flag
    //  }
    // console.log(this.sv);
    localStorage.setItem('SelectedHead', JSON.stringify(event.value));
    //  console.log(localStorage.getItem('headCountry'));
    window.location.reload();
  }

  getCountries() {
    this.service.GetCountryList().subscribe((Response) => {
      this.countries = Response;
      // localStorage.setItem('headCountry',this.countries[0].id);
      if (localStorage.getItem('SelectedHead') == null) {
        this.selectedCountry = {
          id: this.countries[0].id,
          country: this.countries[0].country,
          flag: this.countries[0].flag
        }
        localStorage.setItem('headCountry', this.countries[0].id);
      } else {
        this.selectedCountry = JSON.parse(localStorage.getItem('SelectedHead'));
        // localStorage.setItem('headCountry',this.countries[0].id);
      }
      // console.log(this.countries)
    })
  }
  userId: any;
  getuserdetails() {
    console.log('getuserdetails');
    this.authservice.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        // Support both array and single-object responses
        const user: any = Array.isArray(res) ? res[0] : res;

        this.userId = user?.id;
        this.email = user?.email || "";
        console.log(user)

        // Name can be in different fields depending on backend
        this.name =
          user?.name ||
          user?.full_name ||
          user?.username ||
          this.email?.split("@")[0] ||
          "";

        // Safely derive first letter (fallback to email if needed)
        const sourceForInitial = this.name || this.email || "";
        this.firstletter = sourceForInitial
          ? sourceForInitial.charAt(0).toUpperCase()
          : "";

        this.usertypename = user?.type || "";
        localStorage.setItem("userid", this.userId)
        if (user?.usertype_id == 3) {
          this.usertype = true
        } else {
          this.usertype = false
        }

        try {
          if (localStorage.getItem('headCountry') == null) {
            const reviewCountry =
              user?.review_org_country?.[0] ??
              user?.review_org_country_id ??
              null;
            if (reviewCountry !== null && reviewCountry !== undefined) {
              this.headForm.patchValue({
                country: reviewCountry,
              });
            }
          } else {
            this.headForm.patchValue({
              country: localStorage.getItem('headCountry'),
            });
          }
        } catch (e) {
          // Fail silently if structure is different; header will still render
        }
        // alert(res.userdetails[0].review_org_country[0])

      })
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