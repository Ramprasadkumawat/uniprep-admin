import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from 'ngx-localstorage';
@Component({
    selector: 'uni-travel-and-tourism',
    templateUrl: './travel-and-tourism.component.html',
    styleUrls: ['./travel-and-tourism.component.scss'],
    standalone: false
})
export class TravelAndTourismComponent implements OnInit {
  storageSubCategory: any;
  constructor(private storage: LocalStorageService,) { }

  ngOnInit(): void {
    this.storageSubCategory = this.storage.get<any>('sub-category')
  }

}
