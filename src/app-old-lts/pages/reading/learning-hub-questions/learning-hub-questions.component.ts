import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';

@Component({
    selector: 'uni-learning-hub-questions',
    templateUrl: './learning-hub-questions.component.html',
    styleUrls: ['./learning-hub-questions.component.scss'],
    standalone: false
})
export class LearningHubQuestionsComponent implements OnInit {

  storageSubCategory: any;
  constructor(private storage: LocalStorageService,) {
  }
  ngOnInit(): void {
    this.storageSubCategory = this.storage.get<any>('sub-category');
  }
}
