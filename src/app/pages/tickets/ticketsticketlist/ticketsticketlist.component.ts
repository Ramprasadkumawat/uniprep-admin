import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {forkJoin, mergeMap, Observable, of} from "rxjs";
import {SelectModule} from "primeng/select";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

import {MessageService} from "primeng/api";
import { Component, OnInit } from '@angular/core';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { UserFacadeService } from '../../users/user-facade.service';
@Component({
    selector: 'uni-ticketsticketlist',
    templateUrl: './ticketsticketlist.component.html',
    styleUrls: ['./ticketsticketlist.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule,
        FormsModule]
})
export class TicketsticketlistComponent implements OnInit {
  users$!: Observable<{ users: User[], totalRecords: number}>;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  filterForm: FormGroup;
  submitted = false;
  contactMethod:any;
  contact:any;
  pageSize=10;
  users: any[] = [
    {no:"1",details:"asdf",planname:"ten",date:"123",categ:"123",priority:"first",inf:"546",expanded: false,}
  ];
  constructor( private userFacade: UserFacadeService, private router:Router,private fb: FormBuilder,private route:Router) {
    this.filterForm = fb.group({
      name: [''],
      email: [''],
      phone: [''],
      category: [''],
      Priority: [''],
    });
   }

  ngOnInit(): void {
  }
  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  filtersubmit(){
    var data={
      name:this.filterForm.value.name,
      email:this.filterForm.value.email,
      phone:this.filterForm.value.phone,
      category:this.filterForm.value.category,
      priority:this.filterForm.value.priority,
    }
  }
  pageChange(event: any) {
    const page = event.first / this.pageSize + 1;
    this.userFacade.loadUsers({page});
  }
  redirecttochat(){
    this.route.navigate(['/supportchat']);
  }
}
