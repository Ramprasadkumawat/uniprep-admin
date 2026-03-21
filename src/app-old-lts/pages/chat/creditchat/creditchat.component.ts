import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import { MenuItem } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import {TableModule} from "primeng/table";
import {AccordionModule} from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserFacadeService } from '../../users/user-facade.service';
import {CreditChatService} from "./creditchat.service";
@Component({
    selector: 'uni-creditchat',
    templateUrl: './creditchat.component.html',
    styleUrls: ['./creditchat.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule
    ]
})
export class CreditchatComponent implements OnInit {

  filterForm: FormGroup;
  submitted = false;
  pageSize=10;
  chats: any[] = [];
  constructor(private userFacade: UserFacadeService, private router:Router,private fb: FormBuilder,private  service:CreditChatService) {
    this.filterForm = fb.group({
      name: [''],
      email: [''],
      phone: [''],
      // category: [''],
      // Priority: [''],
    });
   }
  datacount:number=0;
  data:any={page:1,perpage:this.pageSize}
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize
    }
    this.getchats(this.data);
  }
  getchats(data:any){
    this.service.getChatList(data).subscribe((response) => {
      this.chats=[];
      this.chats=response.userlist;
      this.datacount=response.userlist.length;
    })
  }
  ngOnInit(): void {
    this.getchats(this.data);
  }
  filtersubmit(){
  let formdata = this.filterForm.value;
    this.data.name = formdata?.name;
    this.data.email = formdata?.email;
    this.data.mobile = formdata?.phone;
  this.getchats(this.data)
  }
  reset() {
    window.location.reload();
  }
}
