import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import { MenuItem } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import {TableModule} from "primeng/table";
import {AccordionModule} from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@Component({
    selector: 'uni-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, FontAwesomeModule
    ],
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
