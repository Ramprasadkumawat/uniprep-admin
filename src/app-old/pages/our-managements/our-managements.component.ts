import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { OurManagementService } from './our-management.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { TeamMember } from 'src/app/@Models/our-management.model';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {SelectModule} from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BlukUploadComponent } from "../../@shared/components/bluk-upload/bulk-upload.component";

@Component({
    selector: 'uni-our-managements',
    imports: [
        CommonModule,
        AccordionModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        TextareaModule,
        PaginatorModule,
        ReactiveFormsModule,
        SelectButtonModule,
        RippleModule,
        FileUploadModule,
        RouterModule,
        ScrollTopModule,
        BlukUploadComponent
    ],
    templateUrl: './our-managements.component.html',
    styleUrls: ['./our-managements.component.scss']
})
export class OurManagementsComponent implements OnInit {
  files: any = [];
  memberManagementForm: FormGroup
  memberManagements: TeamMember[] = []
  statuses: {id: number , name: string}[] = []
  // Pagination
  id: number = NaN;
  first = 0
  page = 1;
  pageSize: number = 10;
  totalRecords = 0;
  importModal: 'none' | 'block' = 'none';
  selectedFile: any;
  submitted: boolean = false;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private memberManagementService: OurManagementService, private router: Router, private toastService: MessageService) {
    this.memberManagementForm = this.fb.group({
      id: [null],
      name: ["", Validators.required],
      designation: ["", Validators.required],
      linkedin_url: ["", [Validators.required, Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)]],
      status: [null, Validators.required], // Default to Active
      image: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.getMemberManagementList();
    this.getDropDownList();
  }

  submitmemberManagement(): void {
    if (this.memberManagementForm.invalid) {
      Object.keys(this.memberManagementForm.controls).forEach(controlName => {
        const control = this.memberManagementForm.get(controlName);
        control.markAsTouched();
      });
      return;
    }
    const formData = new FormData()
    const formValue = this.memberManagementForm.value
    Object.keys(formValue).forEach((key) => {
      if (key !== "image" && formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key])
      }
    });

    if (this.id) {
      if (this.selectedFile) {
        formData.append("image", this.selectedFile)
      } else {
        formData.append("image", formValue.image)
      }
      formData.append("id", this.id.toString());
      this.memberManagementService.updateMemberManagementData(formData).subscribe({
        next: response => {
          if (response.success) {
            this.toastService.add({
              severity: 'success',
              summary: 'Member updated successfully'
            });
            this.memberManagementForm.reset();
            this.getMemberManagementList();
            this.id = NaN;
            this.selectedFile = null;
          }
        },
        error: error => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message
          });
        }
      });
    } else {
      if (this.selectedFile) {
        formData.append("image", this.selectedFile);
      } 
      this.memberManagementService.addMemberManagementData(formData).subscribe({
        next: response => {
          if (response.success) {
            this.toastService.add({
              severity: 'success',
              summary: 'Member added successfully'
            });
            this.getMemberManagementList();
            this.selectedFile = null;
          }
        },
        error: error => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message
          });
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.files[0]

    if (this.selectedFile) {
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.memberManagementForm.patchValue({ image: this.selectedFile.name});
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }


  get f() {
    return this.memberManagementForm.controls;
  }

  searchManagement(event: any): void {
    const searchValue = event.target.value;
    if (searchValue) {
      this.getMemberManagementList({ keyword: searchValue });
    } else {
      this.getMemberManagementList();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.pageSize = event.rows;
    this.getMemberManagementList();
  }

  editMemberManagement(member: TeamMember, event): void {
    this.id = member?.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('p-accordion').scrollIntoView({ behavior: 'smooth' });
    if (member) {
    this.memberManagementForm.patchValue({
      id: member.id,
      name: member.name,
      designation: member.designation,
      linkedin_url: member.linkedin_url || "",
      status: member.status,
      image: member.image,
    });
    this.imagePreview = member.image;
  } else {
    this.imagePreview = null;
    this.memberManagementForm.reset()
  }
}

  resetManagementFields() {
    this.id = NaN;
    this.imagePreview = null;
    this.memberManagementForm.reset();
    this.selectedFile = null;
  }

getMemberManagementList(params?: any) {
    const data = {
      page: this.page,
      perpage: this.pageSize,
      ...params
    }
  console.log({ data });
    this.memberManagementService.getMemberManagementList(data).subscribe({
      next: response => {
        if (response.success) {
          this.memberManagements = response.managements;
          this.totalRecords = response.totalManagements;
        }
      },
      error: error => {
        console.log(error.error.message);
      }
    })
  }

  getStatusLabel(status: number): string {
    return status === 1 ? "Active" : "Inactive"
  }

  getStatusClass(status: number): string {
    return status === 1 ? "active-status" : "inactive-status"
  }

  getDropDownList() {
    this.memberManagementService.getDropDownList().subscribe({
      next: response => {
        this.statuses = response.seo_status;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  // // bulk upload codes
  // onFileChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement?.files?.length) {
  //     this.selectedFile = inputElement.files[0];
  //   } else {
  //     this.selectedFile = null;
  //   }
  // }

  // uploadFile() {
  //   if (this.selectedFile) {
  //     this.memberManagementService.bulkUploadFile(this.selectedFile).subscribe(
  //       (response) => {
  //         this.selectedFile = null;
  //         if (response.status == "true") {
  //           this.toastService.add({
  //             severity: "success",
  //             summary: "Success",
  //             detail: response.message,
  //           });
  //           this.getLandingDataList();
  //           this.importModal = 'none';
  //         } else {
  //           this.toastService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: response.message,
  //           });
  //           this.getLandingDataList();
  //           this.importModal = 'none';
  //         }
  //       },
  //       (error) => {
  //         this.toastService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.message,
  //         });
  //       }
  //     );
  //   } else {
  //     this.toastService.add({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Please choose file!",
  //     });
  //   }
  // }



}
