import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'uni-addcomponent-stories-modules',
    templateUrl: './addcomponent-stories-modules.component.html',
    styleUrls: ['./addcomponent-stories-modules.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, DialogModule
    ]
})
export class AddcomponentStoriesModulesComponent implements OnInit {
  form: FormGroup;
  filterForm:FormGroup;
  submitted = false;
  constructor( private fb: FormBuilder,) { 
        this.form = fb.group({
          urlslug: ["", [Validators.required]],
        });
        this.filterForm=fb.group({
        })
  }

  ngOnInit(): void {
  }
  submitForm(){

  }
  resetForm(){

  }
  get f() {
    return this.form.controls;
  }
}
