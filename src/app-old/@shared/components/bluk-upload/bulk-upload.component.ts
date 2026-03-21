import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BulkUploadService } from './bluk-upload.service';

@Component({
    selector: 'uni-bulk-upload',
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class BlukUploadComponent {
  @Input() uploadApiUrl!: string;
  @Input() sampleFileUrl!: string; 
  @Output() uploadSuccess = new EventEmitter<any>();

  selectedFile: File | null = null;
  importModal: 'block' | 'none' = 'none';

  constructor(private http: HttpClient, private toast: MessageService, private bulkService: BulkUploadService) { }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please choose file!' });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.bulkService.bulkUploadFile(this.uploadApiUrl, formData)
    .subscribe({
      next: (res) => {
        this.selectedFile = null;
        this.toast.add({ severity: res.status === 'true' ? 'success' : 'error', summary: res.status, detail: res.message });
        if (res.status === 'true') this.uploadSuccess.emit(res);
        this.importModal = 'none';
      },
      error: (err) => {
        // this.toast.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    });
  }

}
