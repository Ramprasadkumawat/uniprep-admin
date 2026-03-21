import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "ngx-localstorage";

@Component({
    selector: 'uni-k12',
    templateUrl: './k12.component.html',
    styleUrls: ['./k12.component.scss'],
    standalone: false
})
export class K12Component implements OnInit {
  storageSubCategory: any;
  constructor(private storage: LocalStorageService,) {
  }
  ngOnInit(): void {
    this.storageSubCategory = this.storage.get<any>('sub-category');
  }

}
