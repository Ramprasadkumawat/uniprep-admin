import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';

@Component({
    selector: 'uni-skill-mastery',
    templateUrl: './skill-mastery.component.html',
    styleUrls: ['./skill-mastery.component.scss'],
    standalone: false
})
export class SkillMasteryComponent implements OnInit {

  storageSubCategory: any;
  constructor(private storage: LocalStorageService) {
  }
  ngOnInit(): void {
    this.storageSubCategory = this.storage.get<any>('sub-category');
  }

}
