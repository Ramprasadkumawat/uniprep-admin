import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule , FormGroup , FormControl , FormBuilder , NgForm ,Validators} from '@angular/forms';
import {MessageService} from "primeng/api";
import { AddreviewquestionService } from './addreviewquestion.service';

@Component({
    selector: 'uni-addreviewquestion',
    imports: [CommonModule, AccordionModule, ReactiveFormsModule],
    templateUrl: './addreviewquestion.component.html',
    styleUrls: ['./addreviewquestion.component.scss']
})


export class AddreviewquestionComponent implements OnInit {
  questionForm: FormGroup;
  modules: any;
  submodules: any;
  ModuleId:number;
  countries: any;
  constructor(private formbuilder: FormBuilder ,  private service: AddreviewquestionService) { }

  ngOnInit(): void {

    this.questionForm = this.formbuilder.group({
      country:['',Validators.required],
      module:['',Validators.required],
      submodule:['',Validators.required],
      question:['',Validators.required],
      answer:['',Validators.required],
      videoLink:['',Validators.required],
      imageLink:['',Validators.required],

    })

    this.getModules();
    this.getCountry();

  }

  addquestion(){
      let data = {

      }
  }

  getModules(){
    this.service.GetModuleName().subscribe((res) => {
      this.modules = res.modules
    })
  }

  getCountry(){
    this.service.Countrylist().subscribe((res) => {
      this.countries = res;
    })
  }

  getSubmodules(){
    let data = {
      moduleId : this.ModuleId,
    }
    alert(this.ModuleId);
    this.service.GetSubmoduleName(data).subscribe((res) => {
      this.submodules = res
    })
  }

}
