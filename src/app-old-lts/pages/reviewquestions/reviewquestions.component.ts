import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {CarouselModule} from 'primeng/carousel';
import { ReviewquestionsService } from './reviewquestions.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DialogModule} from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';


import { FormsModule , FormGroup , FormControl , FormBuilder , NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';

@Component({
    selector: 'uni-reviewquestions',
    imports: [CommonModule, AccordionModule, InputTextModule, PanelModule, CarouselModule, DialogModule, DynamicDialogModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    templateUrl: './reviewquestions.component.html',
    styleUrls: ['./reviewquestions.component.scss']
})
export class ReviewquestionsComponent implements OnInit {
  responsiveOptions: any;
  questions: any;
  module: any;
  submodule: any;
  siglequestion: any;
  display: boolean = false;
  modulename: string;
  submodulename: string;
  videos: any;
  reviewform:FormGroup;
  questionId: number;
  reviewValue:any;
  perPage:number;
  totalcount: number;
  pageno:number = 1;
  // submoduleName: string;
  // moduleName: string;


  constructor( private service: ReviewquestionsService,private router: Router , private route: ActivatedRoute , private formbuilder: FormBuilder){ 
   
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  this.reviewform = formbuilder.group({
    status:new FormControl(),
    questionId:new FormControl(),
    suggestion:new FormControl(),
  });

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.module = this.route.snapshot.paramMap.get("module");
      this.submodule = this.route.snapshot.paramMap.get("submodule");
      let data = {
        moduleId : this.module,
        submoduleId : this.submodule,
        countryId : localStorage.getItem('headCountry'),
        perpage : 10,
        page : 1,
      }
      this.getQuestion(data);
    });
  }

  getQuestion(data){
     this.service.GetQuestions(data).subscribe((res) =>{
      this.questions = res;
      this.totalcount = res.QuestionCount;
    })
  }

  showDialog(id) {  
    let data = {
      question_id : id
    }
    this.service.GetOneQuestion(data).subscribe((res) =>{
      this.siglequestion = res.question;
      this.modulename = res.module+" - "+res.submodule;
      this.videos = res.question.videolink
    })
    this.questionId = id;
    this.display = true;
  }

  postData(reviewform: any){
    let rdata = {
      questionId : this.questionId,
      suggestion : reviewform.controls.suggestion.value,
      review_status : reviewform.controls.status.value     //1=reviewd 2=suggestion
    }

    this.service.SubmitSuggestion(rdata).subscribe((res)=>{
      let data = {
        moduleId : this.module,
        submoduleId : this.submodule,
        countryId : 2,
        perpage : 10,
        page : this.pageno,
        reviewed : this.reviewValue
      }
      this.getQuestion(data);
      this.display = false;
    })

  }


  filterStatus(){
      //alert(localStorage.getItem('headCountry'));


      let data = {
        moduleId : this.module,
        submoduleId : this.submodule,
        countryId : localStorage.getItem('headCountry'),
        perpage : 20,
        page : 1,
        reviewed : this.reviewValue
      }
      this.getQuestion(data);
  }

  paginate(event: any){
    this.pageno = (event.page ?? 0) + 1; 
    let data = {
      moduleId : this.module,
      submoduleId : this.submodule,
      countryId : 2,
      perpage : 10,
      page : event.page + 1,
      reviewed : this.reviewValue
    }
    this.getQuestion(data);
  }

  addSuggestionPage(){
    this.router.navigate(['/review/addquestion']);
  }
}
