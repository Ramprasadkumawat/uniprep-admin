import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
 
@Component({
    selector: 'uni-languagehblist',
    templateUrl: './languagehblist.component.html',
    styleUrls: ['./languagehblist.component.scss'],
    standalone: false
})
export class LanguagehblistComponent implements OnInit {

  countryList: any;
  learninghublist: any[] = []
  learningHubListCount: number = 0;
  currentPageName: string = 'Language Hub Quiz';
  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.getlanguageHubCategory();
  }
 
  getlanguageHubCategory() {
    this.quizService.getLanguagehublist().subscribe((res: any) => {
      this.learninghublist = res.data;
      this.learningHubListCount = this.learninghublist.length;
    })
  }
  goBack() {
    this.getlanguageHubCategory();
    this.currentPageName='Language Hub Quiz';
  }
  languageidsaveforquiz:any
  getlanguageHubSubCategory(id:any) {
    this.languageidsaveforquiz=id;
    console.log( this.languageidsaveforquiz);
    var data={
      languageid:this.languageidsaveforquiz
    }
    this.quizService.getLanguagehubtype(data).subscribe((res: any) => {
      this.currentPageName='Language Hub Submodlue list';
      this.learninghublist = res.data;
      this.learningHubListCount = this.learninghublist.length;
    })
  }


}

