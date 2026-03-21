import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContributionsService } from '../../contributions-program.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

export interface DropDown{
  id: number;
  value: string
}
@Component({
    selector: 'uni-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
    standalone: false
})
export class EventDetailsComponent implements OnInit {
  form: FormGroup;
  galleryForm: FormGroup;
  eventId: number = 0;
  galleryId: number = 0;
  isAddEditGallery: boolean = false;
  currentEvents: any = [];
  eventType: DropDown[] = [
    {
      id: 1,
      value: "Faculty Event"
    },
    {
      id: 2,
      value: "Student Event"
    }
  ];
  galleryItemsCount:number = 0;
  galleryItems: any = [];
  galleryPageSize: number = 20;
  galleryPage: number = 1;
  galleryFirst: number = 0;
  coverThumbnailImage: string = "";
  gallerySubmitted: boolean;
  selectedFile: File;
  coverSelectedFile: File;
  page: number;
  pageSize: number;
  submitted: boolean = false;
  selectedFiles: File[];
  fileNames: string[] = [];
  thumbnailImages: any[];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mainService: ContributionsService,
    private toastr: MessageService,
    private confirmationService: ConfirmationService,
  ) { 
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      link: [''],
      location: ['',[Validators.required]],
      cover_image: [''],
      info: ['', [Validators.required]],
    });

    this.galleryForm = this.fb.group({
      title: ['', Validators.required],
      youtube_link: [''],
      image: ['', Validators.required]
    });

    this.form.controls['link'].valueChanges.subscribe(value =>{
      if(value&& value != null){
        this.form.controls["cover_image"].setValidators(Validators.required);
        this.form.controls["cover_image"].updateValueAndValidity();
      }else{
        this.form.controls["cover_image"].setErrors(null);
        this.form.get("cover_image").clearValidators();
        this.form.controls["cover_image"].updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.params.id;
    this.eventId = eventId
    this.listOfEvents();
    this.listOfGalleryItems();
  }

  listOfEvents(){
    this.mainService.listOfEvents({id: this.eventId}).subscribe({
      next: response =>{
        if(response.data.length){
          this.currentEvents = response.data[0];
          this.form.patchValue({
            name: this.currentEvents.name,
            type: this.currentEvents.type == "Faculty Event" ? 1 : 2,
            link: this.currentEvents.link,
            location: this.currentEvents.location,
            info: this.currentEvents.event_info,
            cover_image: this.currentEvents.cover_image
          })
          if(this.currentEvents.cover_image){
            this.coverThumbnailImage = this.currentEvents.cover_image_name;
          }
        }
      }
    })
  }

  listOfGalleryItems(){
    let data = {
      event_id: this.eventId,
      page: this.galleryPage,
      pagesize: this.galleryPageSize
    };
    this.mainService.getGalleries(data).subscribe({
      next: response =>{
        if(response.data.length){
          this.galleryItems = response.data;
          this.galleryItemsCount = response.count;
        }
      }
    })
  }

  onSubmitDetails(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('type', this.form.get('type')?.value);
    formData.append('link', this.form.get('link')?.value ?? '');
    formData.append('id', this.eventId.toString());
    formData.append('location', this.form.get('location')?.value);
    formData.append('info', this.form.get('info')?.value);
    
    if (this.coverSelectedFile) {
      formData.append('cover_image', this.coverSelectedFile); // Append actual file, not just its name
    }else{
      formData.append('cover_image', this.form.get('cover_image')?.value ?? '');
    }

    this.mainService.updateEvents(formData).subscribe({
      next: response => {
        this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.listOfEvents();
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  showAddEditGalleryModel(data?: any) {
    this.isAddEditGallery = true;
    if (data) {
      this.selectedFiles = [];
      this.fileNames = [];
      this.thumbnailImages = [];
      this.galleryForm.patchValue({
        title: data?.title,
        youtube_link: data?.youtube_link,
        image: data?.image_name
      });
      this.fileNames.push(data.image);
      this.thumbnailImages.push(data.image_name);
      this.galleryId = data?.id;
    }
  }

  galleryPageChange(event: any) {
    if (this.galleryPageSize == event.rows) {
      this.galleryPage = event.first / event.rows + 1;
    } else {
      this.galleryPage = 1;
    }
    this.galleryPageSize = event.rows;
    this.galleryFirst = event.first;
    this.listOfGalleryItems();
  }

  closeGalleryModal() {
    this.galleryForm.reset();
    this.gallerySubmitted = false;
    this.isAddEditGallery = false;
    this.galleryId = null;
    this.emptyMultipleImages();
  }

  resetGallery() {
    this.page = 1;
    this.pageSize = 10;
    this.listOfGalleryItems();
  }

  onCoverFileChange(event: Event){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.coverSelectedFile = inputElement.files[0];
      this.form.patchValue({
        cover_image: this.coverSelectedFile.name,
      });
      if (this.coverSelectedFile.type.startsWith("image/")) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target.result) {
            this.coverThumbnailImage = e.target.result; // Display the image
          }
        };
        reader.readAsDataURL(this.coverSelectedFile);
      } else if (this.coverSelectedFile.type.startsWith("video/")) {
        this.generateVideoThumbnail(this.coverSelectedFile);
      }
    } else {
      this.coverSelectedFile = null;
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement?.files?.length) return;
  
    const files = Array.from(inputElement.files);
  
    if (this.galleryId) {
      // ✅ If updating → Allow only one file, reset arrays
      this.fileNames = [];
      this.thumbnailImages = [];
      this.selectedFiles = []; 
  
      const file = files[0]; // Take the first file only
      this.processFile(file, 0);
    } else {
      // ✅ If adding → Allow multiple files
      this.fileNames = []; // Reset filenames only for new selections
      this.thumbnailImages = []; // Reset images for new selections
      this.selectedFiles = files; // Store selected files
  
      files.forEach((file, index) => this.processFile(file, index));
    }
  
    // ✅ Update form control with selected file names
    this.galleryForm.patchValue({ 
      image: this.fileNames.length === 1 ? this.fileNames[0] : `${this.fileNames.length} images selected`
    });
  }
  
  
  private processFile(file: File, index: number) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target.result) {
          // ✅ Ensure correct indexing
          this.thumbnailImages[index] = e.target.result;
          this.fileNames[index] = file.name;
          this.selectedFiles[index] = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  
  emptyMultipleImages(){
    this.selectedFiles = [];
    this.fileNames = [];
    this.thumbnailImages = [];
  }

  // Remove an image from the list
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.thumbnailImages.splice(index, 1);
    this.fileNames.splice(index, 1);
  }
  
  // Modify the form submission to append multiple images
  onSubmitGallery() {
    this.gallerySubmitted = true;
    if (this.galleryForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.galleryForm.get('title')?.value);
    formData.append('youtube_link', this.galleryForm.get('youtube_link')?.value);
    formData.append('event_id', this.eventId.toString());
    // Append multiple images
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
      });
    } else {
      formData.append('image', this.galleryForm.get('image')?.value);
    }
  
    if (this.galleryId) {
      formData.append('gallery_id', this.galleryId.toString());
      this.mainService.updateEventgallery(formData).subscribe({
        next: response => {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeGalleryModal();
          this.resetGallery();
        }
      });
    } else {
      this.mainService.addEventGallery(formData).subscribe({
        next: response => {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeGalleryModal();
          this.resetGallery();
        }
      });
    }
  }
  

  generateVideoThumbnail(file: File) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous"; // Ensures CORS compliance if needed
    video.muted = true; // Mute video to allow autoplay
    video.playsInline = true; // Prevent fullscreen mode on iOS
    video.addEventListener("loadeddata", () => {
      // Seek to the first frame
      video.currentTime = 1;
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/jpeg");
          this.thumbnailImages.push(thumbnail);
        }
        URL.revokeObjectURL(video.src); // Free memory
      });
    });
    video.load();
  }

  deteteCollegeGallery(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.mainService.deleteEventGallery({ id: this.galleryId }).subscribe({
          next: response => {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.closeGalleryModal();
            this.resetGallery();
          }
        })
      },
      reject: () => {
        this.toastr.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }

  get gF() {
    return this.galleryForm.controls;
  }
}
