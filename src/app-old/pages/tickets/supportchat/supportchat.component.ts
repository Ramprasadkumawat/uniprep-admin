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
import { Router } from '@angular/router';

@Component({
    selector: 'uni-supportchat',
    templateUrl: './supportchat.component.html',
    styleUrls: ['./supportchat.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule,
        FormsModule]
})
export class SupportchatComponent implements OnInit {
  messages: string[] = [];
  newMessage: any;
  usertype:any
  searchText:any
  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.newMessage) {
      this.messages.push(this.newMessage);
      this.newMessage = '';
    }
  }
  redirecttoticketlist(){
    this.route.navigate(['/ticketslist']);
  }
}
