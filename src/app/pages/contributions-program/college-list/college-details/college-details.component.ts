import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContributionsService } from '../../contributions-program.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { StudentUser } from 'src/app/@Models/contributions-program.model';

interface Article {
  id: number;
  title: string;
  created_at: Date;
  article: string;
  image: string;
  url_slug: string;
}

interface GalleryItem {
  title: string;
  id: number;
  image_name: string;
  file: string;
  thumbnail?: string;
  url: string;
}

@Component({
    selector: 'uni-college-details',
    templateUrl: './college-details.component.html',
    styleUrls: ['./college-details.component.scss'],
    standalone: false
})
export class CollegeDetailsComponent implements OnInit {

  quesionForm: FormGroup = new FormGroup({});
  form: FormGroup = new FormGroup({});
  articleForm: FormGroup = new FormGroup({});
  galleryForm: FormGroup = new FormGroup({});
  first: number = 0;
  collegeId: string;
  articleId: number = null;
  page: number = 1;
  selectedFile: any;
  collegeArticleCount: number = 0;
  articleSubmitted: boolean = false;
  addGalleryModal: string = 'none';
  galleryId: number = null;
  editFile: any;
  galleryItems: GalleryItem[] = [];
  collegeArticleList: any[] = [];
  thumbnailImage: string = '';
  galleryItemsCount: number = 0;
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
  isAddEditArticle: boolean = false;
  isAddEditGallery: boolean = false;
  gallerySubmitted: boolean = false;
  contributorsList: any[] = [];
  galleryFirst: number = 0;
  galleryPage: number = 1;
  galleryPageSize: number = 10;
  galleryObj = {};
  // Assign contributor table
  contributorCount: number = 0;
  listRowCount: number;
  assignForm: FormGroup = new FormGroup({});
  assignContributorId: any;
  isAassignContributor: boolean = false;
  assignConSubmitted: boolean = false;
  contributorsDropdownList: any[] = [];
  pageSize: number = 10;
  assignedContributorObj = {};
  articleFirst: number = 0;
  articlePage: number = 1;
  articlePageSize: number = 10;
  articleObj = {};
  selectedFiles: any;
  editImage: any;
  contributedData: any;
  collegeName: string = '';
  selectedTab: string = 'College Details';
  isSave: boolean = true;
  maxWords = 1000;
  wordCount = 0;
  wordLimitExceeded: boolean = false;
  studentUserList: StudentUser[] = [];

  constructor(
    private fb: FormBuilder,
    private toast: MessageService,
    private activatedRoute: ActivatedRoute,
    private contributorsService: ContributionsService,
    private confirmationService: ConfirmationService,
  ) { 
    this.form = this.fb.group({
      image: [''],
      url_slug: [''],
      college_info: [''],
    });

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      article: ['', Validators.required]
    });

    this.galleryForm = this.fb.group({
      title: ['', Validators.required],
      youtube_link: [''],
      image: ['', Validators.required]
    });
    this.assignForm = this.fb.group({
      total_student: ['', Validators.required],
      contributor_id: ['', Validators.required],
    });

    this.articleForm.controls.article.valueChanges.subscribe((value: string) => {
      if (value) {
        const words = value.replace(/<\/?[^>]+(>|$)/g, '').match(/\b\w+\b/g) || [];
        this.wordCount = words.length;
        this.wordLimitExceeded = this.wordCount > this.maxWords;
        if (this.wordLimitExceeded) {
          // Trim the text to the max word count
          const trimmedText = words.slice(0, this.maxWords).join(' ');
          this.articleForm.controls.article.setValue(trimmedText, { emitEvent: false }); // Prevents infinite loop
        }
      } else {
        this.wordCount = 0;
        this.wordLimitExceeded = false;
      }
    });
  }

  ngOnInit(): void {
    this.collegeId = this.activatedRoute.snapshot?.params?.['id'];
    this.getCollegeDetails();
    this.loadArticleList();
    this.loadGalleryList();
    this.loadContributorList();
    this.getContributorList();
    this.getStudentUserList();
  }

  getCollegeDetails() {
    this.contributorsService.getCollgesDetails(this.collegeId).subscribe({
      next: response => {
        this.form.patchValue({
          image: response.data?.image_name,
          url_slug: response.data?.url_slug,
          college_info: response.data?.college_info,
        });
        this.editImage = response.data?.image_name;
        this.collegeName = response.data?.name;
        if (response.data?.image_name || response.data?.url_slug || response.data?.college_info) {
          this.isSave = false;
        }
      },
      error: err => {
        console.log(err?.message);
      }
    })
  }

  getStudentUserList() {
    this.contributorsService.getStudentUsers(this.collegeId).subscribe({
      next: response => {
        this.studentUserList = response.data;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  onSubmitDetails() {
    const formData = this.form.value;
    if (this.selectedFiles) {
      formData.image = this.selectedFiles;
    }
    this.contributorsService.updateCollegeInfo({ id: this.collegeId, ...formData }).subscribe({
      next: response => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onFileChanges(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFiles = inputElement.files[0];
      this.form.patchValue({
        image: this.selectedFiles.name,
      });
      let reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target.result) {
          this.editImage = event.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFiles);
    } else {
      this.selectedFiles = null;
    }
  }

  //Articles
  get artF() {
    return this.articleForm.controls;
  }

  loadArticleList() {
    this.articleObj = {
      page: this.articlePage,
      perpage: this.articlePageSize,
      college_contribution_id: this.collegeId
    }
    this.getCollegeArticleList(this.articleObj);
  }

  getCollegeArticleList(value: any) {
    this.contributorsService.getCollegeArticleList(value).subscribe({
      next: response => {
        this.collegeArticleList = response.college_articles;
        this.collegeArticleCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  articlePageChange(event: any) {
    if (this.articlePageSize == event.rows) {
      this.articlePage = event.first / event.rows + 1;
    } else {
      this.articlePage = 1;
    }
    this.articlePageSize = event.rows;
    this.articleFirst = event.first;
    this.getCollegeArticleList({ ...this.articleObj, page: this.articlePage, perpage: this.articlePageSize });
  }

  resetArticle() {
    this.page = 1;
    this.pageSize = 10;
    this.getCollegeArticleList({ ...this.articleObj, page: this.articlePage, perpage: this.articlePageSize });
  }

  closeArticleModal() {
    this.articleForm.reset();
    this.articleSubmitted = false;
    this.isAddEditArticle = false;
    this.articleId = null;
  }

  showAddEditArticleModel(data?: Article) {
    this.isAddEditArticle = true;
    if (data) {
      this.articleForm.patchValue({
        title: data?.title,
        url_slug: data?.url_slug,
        article: data?.article,
      });
      this.articleId = data?.id;
    }
  }

  onSubmitArticle() {
    this.articleSubmitted = true;
    if (this.articleForm.invalid) {
      return;
    }
    if (this.articleId) {
      this.contributorsService.updateCollegeArticle({ college_article_id: this.articleId, ...this.articleForm.value, college_contribution_id: this.collegeId }).subscribe({
        next: response => {
          if (response?.success) {
            this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
            const articleData = this.collegeArticleList.find((item) => item.id == this.articleId);
            if (articleData) {
              articleData.title = response.data.title;
              articleData.url_slug = response.data.url_slug;
              articleData.article = response.data.article;
            }
            this.articleId = null;
            this.closeArticleModal();
          }
        },
        error: error => {
          console.log(error?.message);
        }
      });
    } else {
      this.contributorsService.addCollegeArticle({ ...this.articleForm.value, college_contribution_id: this.collegeId }).subscribe({
        next: response => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeArticleModal();
          this.resetArticle();
        },
        error: error => {
          console.log(error?.message);
        }
      });
    }
  }

  deteteCollegeArticle(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.contributorsService.deteteCollegeArticle({ id: this.articleId }).subscribe({
          next: res => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.closeArticleModal();
            this.resetArticle();
          },
          error: err => {
            console.log(err?.message)
          }
        })
      },
      reject: () => {
        this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }

  // gallery

  get gF() {
    return this.galleryForm.controls;
  }

  loadGalleryList() {
    this.galleryObj = {
      page: this.galleryPage,
      perpage: this.galleryPageSize,
      college_contribution_id: this.collegeId
    }
    this.getCollegeGalleryList(this.galleryObj);
  }

  getCollegeGalleryList(value: any) {
    this.contributorsService.getCollegeGalleryList(value).subscribe({
      next: response => {
        this.galleryItems = response.data;
        this.galleryItemsCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  galleryPageChange(event: any) {
    if (this.galleryPageSize == event.rows) {
      this.galleryPage = event.first / event.rows + 1;
    } else {
      this.galleryPage = 1;
    }
    this.galleryPageSize = event.rows;
    this.galleryFirst = event.first;
    this.getCollegeGalleryList({ ...this.galleryObj, page: this.galleryPage, perpage: this.galleryPageSize });
  }

  resetGallery() {
    this.page = 1;
    this.pageSize = 10;
    this.getCollegeGalleryList({ ...this.galleryObj, page: this.galleryPage, perpage: this.galleryPageSize });
  }

  showAddEditGalleryModel(data?: any) {
    this.isAddEditGallery = true;
    if (data) {
      this.galleryForm.patchValue({
        title: data?.title,
        youtube_link: data?.youtube_link,
        image: data?.image_name
      });
      this.thumbnailImage = data.image_name;
      this.galleryId = data?.id;
    }

  }

  onSubmitGallery() {
    this.gallerySubmitted = true;
    if (this.galleryForm.invalid) {
      return;
    }
    const formData = this.galleryForm.value;
    if (this.selectedFile) {
      formData.image = this.selectedFile;
    }
    if (this.galleryId) {
      this.contributorsService.updateContributeGallery({ ...formData }, this.collegeId).subscribe({
        next: response => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeGalleryModal();
          this.resetGallery();
          this.galleryId = null;
        },
        error: error => {
          console.log(error?.message);
        }
      });
    } else {
      this.contributorsService.addCollegeGallery({ ...formData, college_contribution_id: this.collegeId }).subscribe({
        next: response => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeGalleryModal();
          this.resetGallery();
        },
        error: error => {
          console.log(error?.message);
        }
      });
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      this.galleryForm.patchValue({
        image: this.selectedFile.name,
      });
      if (this.selectedFile.type.startsWith("image/")) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target.result) {
            this.thumbnailImage = e.target.result; // Display the image
          }
        };
        reader.readAsDataURL(this.selectedFile);
      } else if (this.selectedFile.type.startsWith("video/")) {
        this.generateVideoThumbnail(this.selectedFile);
      }
    } else {
      this.selectedFile = null;
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
          this.thumbnailImage = canvas.toDataURL("image/jpeg"); // Save thumbnail as Base64
        }
        URL.revokeObjectURL(video.src); // Free memory
      });
    });
    video.load();
  }

  closeGalleryModal() {
    this.galleryForm.reset();
    this.gallerySubmitted = false;
    this.isAddEditGallery = false;
    this.galleryId = null;
    this.thumbnailImage = null;
  }

  deteteCollegeGallery(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.contributorsService.deteteCollegeGallery({ id: this.galleryId }).subscribe({
          next: res => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.closeGalleryModal();
            this.resetGallery();
          },
          error: err => {
            console.log(err?.message)
          }
        })
      },
      reject: () => {
        this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });

  }


  getContributorList() {
    this.contributorsService.getContributorList({}).subscribe((response) => {
      this.contributorsDropdownList = response.data;
    });
  }

  loadContributorList() {
    this.assignedContributorObj = {
      page: this.page,
      perpage: this.pageSize,
      college_contributor_id: this.collegeId
    }
    this.getAssignedContributorList(this.assignedContributorObj);
  }

  getAssignedContributorList(value: any) {
    this.contributorsService.getAssignedContributors(value).subscribe({
      next: response => {
        this.contributorsList = response.data;
        this.contributorCount = response?.summary?.count;
        this.contributedData = response.summary;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getAssignedContributorList({ ...this.assignedContributorObj, page: this.page, perpage: this.pageSize });
  }

  resetAssignFilter() {
    this.page = 1;
    this.pageSize = 10;
    this.assignedContributorObj = {
      page: 1,
      perpage: this.pageSize,
      college_contributor_id: this.collegeId
    }
    this.getAssignedContributorList(this.assignedContributorObj);
  }

  onShowAddEditContributor(data?: any) {
    if (data) {
      this.assignForm.patchValue({
        total_student: data?.total_student,
        contributor_id: data?.contributor_id,
      });
      this.assignContributorId = data?.id;
    }
    this.isAassignContributor = true;
  }

  onSubmitAssignContributor() {
    this.assignConSubmitted = true;
    if (this.assignForm.invalid) {
      return;
    }
    if (this.assignContributorId) {
      this.contributorsService.updateAssignedContributor({ id: this.assignContributorId, ...this.assignForm.value, college_contribution_id: this.collegeId }).subscribe({
        next: response => {
          if (response?.success) {
            this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.assignContributorId = null;
            this.closeAssignModal();
            this.resetAssignFilter();
          }
        },
        error: error => {
          console.log(error?.message);
        }
      });
    } else {
      this.contributorsService.addAssignedContributor({ ...this.assignForm.value, college_contributor_id: this.collegeId }).subscribe({
        next: response => {
          if (response.success) {
            this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.closeAssignModal();
            this.resetAssignFilter();
          }
        },
        error: error => {
          console.log(error?.message);
        }
      });
    }
  }

  get assF() {
    return this.assignForm.controls;
  }

  closeAssignModal() {
    this.assignForm.reset();
    this.assignConSubmitted = false;
    this.isAassignContributor = false;
    this.assignContributorId = null;
  }

  deteteAssignContributor(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.contributorsService.deteteAssignedContributor({ id: this.assignContributorId }).subscribe({
          next: res => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.closeAssignModal();
            this.resetAssignFilter();
          },
          error: err => {
            console.log(err?.message)
          }
        });
      },
      reject: () => {
        this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected" });
      },
    });
  }
  onChangeTab(event: any) {
    const urls: { [key: number]: string } = {
      0: "Colloge Details",
      1: "Articles",
      2: "Gallery"
    };
    this.selectedTab = urls[event.index] || "";
  }
}
