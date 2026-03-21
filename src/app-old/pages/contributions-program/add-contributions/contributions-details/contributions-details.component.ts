import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContributionsService } from '../../contributions-program.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { Location } from '@angular/common';
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
  file_type: 'image' | 'video';
  file: string;
  thumbnail?: string;
  url: string;
}

@Component({
    selector: 'uni-contributions-details',
    templateUrl: './contributions-details.component.html',
    styleUrls: ['./contributions-details.component.scss'],
    standalone: false
})
export class ContributionsDetailsComponent implements OnInit {
  quesionForm: FormGroup = new FormGroup({});
  form: FormGroup = new FormGroup({});
  articleForm: FormGroup = new FormGroup({});
  first: number = 1;
  contributor_id: string;
  articleId: number = null;
  page: number = 0;
  selectedFile: any;
  contributorArticleCount: number = 0;
  articleSubmitted: boolean = false;
  editFile: any;
  contributorArticleList: Article[] = [];
  thumbnailImage: string = '';
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
  isAddEditArticle: boolean = false;
  selectedFiles: any;
  editImage: any;
  pageSize: number = 10;
  articleObj = {};
  contributorName: string = '';
  selectedTab: string = 'Contributor Details';
  maxWords = 1000;
  wordCount = 0;
  wordLimitExceeded = false;

  constructor(
    private fb: FormBuilder,
    private toast: MessageService,
    private activatedRoute: ActivatedRoute,
    private contributorsService: ContributionsService,
    private confirmationService: ConfirmationService,
    private _location: Location
  ) { 
    this.form = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      image: [''],
      url_slug: [''],
      designation: [''],
      contributor_details: [''],
      totalstudent: [''],
      question_answer: this.fb.array([]) // Initialize the FormArray here
    });
    this.quesionForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      article: ['', Validators.required]
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
    this.contributor_id = this.activatedRoute.snapshot?.params?.['id'];
    this.getContributionDetails();
    this.loadContributorList();
  }

  get questionsArray() {
    return this.form.get('question_answer') as FormArray; // Access the FormArray correctly
  }

  addQuestionInArray() {
    const item = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
    this.questionsArray.push(item); // Add question form group to the array
  }

  removeQuestionAndAnswer(index: number) {
    this.questionsArray.removeAt(index);
  }

  onSubmitDetails() {
    const formData = this.form.value;
    formData.image = this.selectedFiles;
    if (typeof formData.phone !== 'string') {
      formData.phone = formData.phone?.number;
    }
    this.contributorsService.updateContributionDetails({ id: this.contributor_id, ...formData }).subscribe({
      next: response => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      },
      error: error => {
        console.log(error.message);
      }
    })

  }

  getContributionDetails() {
    this.questionsArray.clear();
    this.contributorsService.getContributionsDetails(this.contributor_id).subscribe({
      next: response => {
        this.form.patchValue({
          name: response.data?.name,
          email: response.data?.email,
          phone: response.data?.phone,
          image: response.data?.image,
          url_slug: response.data?.url_slug,
          designation: response.data?.designation,
          contributor_details: response.data?.contributor_details,
          totalstudent: response.data?.totalstudent,
        });
        this.editImage = response.data?.image;
        this.contributorName = response.data?.name;
        if (response.data?.question_answer?.length > 0) {
          response.data?.question_answer?.forEach(
            (questionData, index) => {
              this.addQuestionInArray();
              setTimeout(() => {
                this.questionsArray.at(index).patchValue({
                  question: questionData.question,
                  answer: questionData.answer,
                });
              }), 100
            });
        }
        else {
          this.addQuestionInArray();
        }
      },
      error: err => {
        console.log(err?.message);
      }
    })
  }

  updateQuestion() {
    this.questionsArray.push(this.quesionForm); // Add question form group to the array
  }

  submitQuestions() {
    if (this.form.valid) {
      this.contributorsService.updateDetails({ contributor_id: this.contributor_id, question_answer: this.form.value?.question_answer }).subscribe({
        next: response => {
          if (response.success) {
            this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          }
        },
        error: error => {
          console.log(error.message);
        }
      })
    }
  }

  loadContributorList() {
    this.articleObj = {
      page: this.page,
      perpage: this.pageSize,
      contributor_id: this.contributor_id
    }
    this.getContributionsArticleList(this.articleObj);
  }
  getContributionsArticleList(value: any) {
    this.contributorsService.getArticleContributionsList(value).subscribe({
      next: response => {
        this.contributorArticleList = response.contributorarticles;
        this.contributorArticleCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  resetArticle() {
    this.page = 1;
    this.pageSize = 10;
    this.articleObj = {
      page: 1,
      perpage: this.pageSize,
      contributor_id: this.contributor_id
    }
    this.getContributionsArticleList(this.articleObj);
  }

  get artF() {
    return this.articleForm.controls;
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getContributionsArticleList({ ...this.articleObj, page: this.page, perpage: this.pageSize });
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
      this.contributorsService.updateContributorArticle({ id: this.articleId, ...this.articleForm.value, contributor_id: this.contributor_id }).subscribe({
        next: response => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          const articleData = this.contributorArticleList.find((item) => item.id == this.articleId);
          if (articleData) {
            articleData.title = response.data.title;
            articleData.url_slug = response.data.url_slug;
            articleData.article = response.data.article;
          }
          this.closeArticleModal();
        },
        error: err => {
          console.log(err?.message);
        }
      });
    } else {
      this.contributorsService.addContributorArticle({ ...this.articleForm.value, contributor_id: this.contributor_id }).subscribe({
        next: response => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.closeArticleModal();
          this.resetArticle();
        },
        error: err => {
          console.log(err?.message);
        }
      });
    }
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

  deteteArticle(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.contributorsService.deteteContributorArticle({ id: this.articleId }).subscribe({
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

  onChangeTab(event: any) {
    const urls: { [key: number]: string } = {
      0: "Contributor Details",
      1: "Articles"
    };
    this.selectedTab = urls[event.index] || "";
  }

  goBack() {
    this._location.back();
  }
}
