import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocationService} from 'src/app/location.service';
import {ReadingService} from '../reading.service';
import {Question} from 'src/app/@Models/reading.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {LocalStorageService} from 'ngx-localstorage';

@Component({
    selector: 'app-pre-application',
    templateUrl: './pre-application.component.html',
    styleUrls: ['./pre-application.component.scss'],
    standalone: false
})
export class PreApplicationComponent implements OnInit {
    storageSubCategory: any;
    constructor(private storage: LocalStorageService,) {
    }
    ngOnInit(): void {
        this.storageSubCategory = this.storage.get<any>('sub-category');
    }

}
