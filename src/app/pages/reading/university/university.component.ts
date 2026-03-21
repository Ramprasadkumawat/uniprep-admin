import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'src/app/location.service';
import { ReadingService } from '../reading.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Question} from "../../../@Models/reading.model";
import {LocalStorageService} from "ngx-localstorage";
@Component({
    selector: 'uni-university',
    templateUrl: './university.component.html',
    styleUrls: ['./university.component.scss'],
    standalone: false
})
export class UniversityComponent implements OnInit {
  storageSubCategory: any;
  constructor(private storage: LocalStorageService,) {
  }
  ngOnInit(): void {
    this.storageSubCategory = this.storage.get<any>('sub-category');
  }
}
