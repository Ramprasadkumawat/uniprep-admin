import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { filter, forkJoin, mergeMap, Observable, of } from "rxjs";
import { CreateUserParams, User, UserType } from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { login } from "../../Auth/store/actions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { AuthService } from 'src/app/Auth/auth.service';
import { ChartModule } from 'primeng/chart';
// import { stringify } from 'querystring';
import { MycouponService } from './mycoupon.service';
import * as Highcharts from 'highcharts';
import WordcloudModule from 'highcharts/modules/wordcloud';

(WordcloudModule as any)(Highcharts);

@Component({
    selector: 'uni-mycoupon',
    templateUrl: './mycoupon.component.html',
    styleUrls: ['./mycoupon.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule]
})
export class MycouponComponent implements OnInit {
  datacount: number = 0;
  pageSize = 10;
  usertypeid: any;
  constructor(private formbuilder: FormBuilder, private authservice: AuthService, private service: MycouponService) { }

  ngOnInit(): void {
    this.authservice.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        this.usertypeid = res[0].usertype_id
      })
    setTimeout(() => {
      this.getlist()
    }, 1500);

  }
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize,
      usertypeid: this.usertypeid
    };
    this.service.getcoupenlist(this.data).subscribe((response) => {
      this.coupenlists = [];
      this.coupenlists = response.coupons;
      this.datacount = response.count;
    });

  }
  coupenlists: any[] = [];
  getlist() {
    var data = {
      page: 1,
      perpage: this.pageSize,
      usertypeid: this.usertypeid
    }
    this.service.getcoupenlist(data).subscribe((response) => {
      this.coupenlists = [];
      this.coupenlists = response.coupons;
      this.datacount = response.count;
    });
  }

}
