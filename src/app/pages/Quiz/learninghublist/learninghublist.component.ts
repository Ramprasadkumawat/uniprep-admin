import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { environment } from '@env/environment';


@Component({
    selector: 'uni-learninghublist',
    templateUrl: './learninghublist.component.html',
    styleUrls: ['./learninghublist.component.scss'],
    standalone: false
})
export class LearninghublistComponent implements OnInit {
  countryList: any;
  learninghublist: any[] = []
  learningHubListCount: number = 0;
  currentPageName: string = 'Learning Hub Quiz';
  

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.getlearningHubCategory();
  }

  getlearningHubCategory() {
    let data = {
      category_flag: 1
    }
    this.quizService.getlearninghublist(data).subscribe((res: any) => {
      this.learninghublist = res.data;
      this.learningHubListCount = res.count;
    })
  }
  goBack() {
    this.getlearningHubCategory();
    this.currentPageName = 'Learning Hub Quiz';
  }
  getlearningHubSubCategory(list: any) {
    let data = {
      category_id: list.category_id
    }
    this.quizService.getlearninghublist(data).subscribe((res: any) => {
      this.currentPageName = 'Learning Hub Submodlue list';
      this.learninghublist = res.data;
      this.learningHubListCount = res.count;
    })
  }
 

}
