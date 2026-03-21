import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {CarouselModule} from 'primeng/carousel';
import { PreapplicationreviewService } from './preapplicationreview.service';

@Component({
    selector: 'uni-preapplicationreview',
    imports: [CommonModule, AccordionModule, InputTextModule, PanelModule, CarouselModule],
    templateUrl: './preapplicationreview.component.html',
    styleUrls: ['./preapplicationreview.component.scss']
})
export class PreapplicationreviewComponent implements OnInit {
  responsiveOptions: any;

  questions:any ;
  questionData: any;
  videos: any;
  constructor(private service: PreapplicationreviewService) { 
   
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
  }

  ngOnInit(): void {
  }


  getQuestion(question){
    // alert("clicked");
    // alert(question);
    var data = {
      question_id : 2,
    }
    
    this.service.GetQuestionData(data).subscribe((res)=>{
      this.questionData = res.question;
      this.videos = JSON.parse(res.question.videolink);
    })
  }
}
