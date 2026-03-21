import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import { ReviewsuggestionsService } from './reviewsuggestions.service';

@Component({
  selector: 'uni-reviewsuggestions',
  standalone: true,
  imports: [CommonModule,CheckboxModule],
  templateUrl: './reviewsuggestions.component.html',
  styleUrls: ['./reviewsuggestions.component.scss']
})
export class ReviewsuggestionsComponent implements OnInit {
  questioninfo: any;

  constructor( private service: ReviewsuggestionsService) { }

  ngOnInit(): void {

    let questiondata;
    this.service.GetRequestedQuestions(questiondata).subscribe((response) => {
      this.questioninfo = response.data;
    })

  }

}
