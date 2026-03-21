import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { MenuItem } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, EmailValidator } from '@angular/forms';
import { UserFacadeService } from '../../users/user-facade.service';

@Component({
    selector: 'uni-addpartnercoupen',
    templateUrl: './addpartnercoupen.component.html',
    styleUrls: ['./addpartnercoupen.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule
    ]
})
export class AddpartnercoupenComponent implements OnInit {

  users$!: Observable<{ users: User[], totalRecords: number }>;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  form: FormGroup;
  submitted = false;
  users: any[] = [
    { no: "1", details: "asdf", planname: "ten", date: "123", categ: "123", priority: "first", inf: "546", expanded: false, }
  ];
  pageSize = 10;
  statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'InActive' },
  ];
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder,) {
    this.form = fb.group({
      validity: ['', [Validators.required]],
      status: ['', [Validators.required]],
      coupenstartdate: ['', [Validators.required]],
      coupencodegen: ['', [Validators.required]],
      manualcoupenentry: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // dummy data
  }
  get f() {
    return this.form.controls;
  }
  pageChange(event: any) {
    const page = event.first / this.pageSize + 1;
    this.userFacade.loadUsers({ page });
  }
  answer() {
    this.router.navigate(['reading'])
  }
  submitForm() {
    this.submitted = true;
    if (this.form.valid) {

    }
  }

}
