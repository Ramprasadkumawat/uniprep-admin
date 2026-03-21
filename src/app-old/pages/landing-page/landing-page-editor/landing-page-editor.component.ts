import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { LandingPageService } from "../landing-page.service";
import { LandingPage } from "src/app/@Models/landing-page.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";

interface Category {
  id: number;
  name: string;
  code: string;
}

interface Status {
  id: number;
  label: string;
  value: string;
}

interface FileUpload {
  file: File;
  controlName: string;
  formGroupPath?: string;
  formArrayName?: string;
  formArrayIndex?: number;
}

@Component({
    selector: "app-landing-page-editor",
    templateUrl: "./landing-page-editor.component.html",
    styleUrls: ["./landing-page-editor.component.scss"],
    standalone: false
})
export class LandingPageEditorComponent implements OnInit {
  landingPageForm: FormGroup;
  @ViewChild('fileUpload') fileInput: ElementRef;
  id: string = '';
  categories: any[] = [];
  statusOptions: any[] = [];
  uploadedFiles: FileUpload[] = [];
  originalFormValue: any;
  submitted = false;
  files: any = [];
  tagList = [
    { name: "Step 1", id: 1 },
    { name: "Step 2", id: 2 },
    { name: "Step 3", id: 3 },
    { name: "Step 4", id: 4 },
  ]
  // Add emoji regex for validation
  private emojiRegex = /^(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)+$/u;

  constructor(private router: Router, private fb: FormBuilder, private landingPageService: LandingPageService, private route: ActivatedRoute, private toastService: MessageService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Store the original form value for comparison later
    this.originalFormValue = this.landingPageForm.value;
    this.route.params.subscribe(params => {
      if (params['slug']) {
        this.id = params['slug'];
        this.getLandingPageById(params['slug']);
      }
    });
    // this.landingPageId = this.route.snapshot.params.id;
  }

  // Initialize form with empty values matching the backend validation structure
  initializeForm() {
    this.landingPageForm = this.fb.group({
      feature_name: ["", [Validators.required, Validators.maxLength(1000)]],
      featureUrlSlug: ["", Validators.required],
      category: [null, Validators.required],
      tag: ["", [Validators.required, Validators.maxLength(1000)]],
      icon: [null, [Validators.required, this.emojiValidator()]],
      logo: [""],
      order_no: [1, [Validators.required, Validators.min(1)]],
      description: ["", [Validators.required, Validators.maxLength(1000)]],
      image: [""],

      // SEO section
      seo_title: ["", [Validators.required, Validators.maxLength(1000)]],
      meta_description: ["", [Validators.required, Validators.maxLength(1000)]],
      meta_tag: ["", Validators.maxLength(1000)],
      meta_author: ["", Validators.maxLength(1000)],
      seo_status: [1, [Validators.required]],

      // Hero section
      hero_title: ["", [Validators.required, Validators.maxLength(1000)]],
      video_link: ["", [Validators.maxLength(1000)]],
      hero_description: ["", [Validators.required, Validators.maxLength(1000)]],
      hero_coverimage: [""],

      // Dynamic arrays
      chooseus: this.fb.array([]),
      howItWorks: this.fb.array([]),
      whoItsFor: this.fb.array([]),
      faq: this.fb.array([]),

      // Status
      status: [1, Validators.required],
    });
    this.getDropDownList();
    this.addChooseUsItem();
    this.addFaqItem();
    this.addWhoItsForItem();
    this.addHowItWorksItem();
  }

  // Helper methods to create form groups with ID field
  createChooseUsItem(id?: number) {
    return this.fb.group({
      id: [id || null], // Add ID field
      chooseus_icon: ["", [Validators.required, this.emojiValidator()]],
      chooseus_title: ["", [Validators.required]],
      chooseus_subtitle: ["", [Validators.required]],
      chooseus_cardimage: [""]
    });
  }

  createHowItWorksItem(id?: number) {
    return this.fb.group({
      id: [id || null], // Add ID field
      step: [1, [Validators.required, Validators.min(1)]],
      itswork_title: ["", [Validators.required]],
      itswork_subtitle: ["", [Validators.required]],
      itswork_cardimage: [""],
      feature_image: [""]
    });
  }

  createWhoItsForItem(id?: number) {
    return this.fb.group({
      id: [id || null], // Add ID field
      itsfor_title: ["", [Validators.required]],
      itsfor_subtitle: ["", [Validators.required]],
      itsfor_cardimage: [""]
    });
  }

  createFaqItem(id?: number) {
    return this.fb.group({
      id: [id || null], // Add ID field
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
    });
  }

  // Methods to add new items to form arrays
  get chooseUsArray() {
    return this.landingPageForm.get("chooseus") as FormArray;
  }

  addChooseUsItem(id?: number) {
    this.chooseUsArray.push(this.createChooseUsItem(id));
  }

  removeChooseUsItem(index: number) {
    this.chooseUsArray.removeAt(index);
  }

  get howItWorksArray() {
    return this.landingPageForm.get("howItWorks") as FormArray;
  }

  addHowItWorksItem(id?: number) {
    this.howItWorksArray.push(this.createHowItWorksItem(id));
  }

  removeHowItWorksItem(index: number) {
    if (index > 0)
      this.howItWorksArray.removeAt(index);
  }

  get whoItsForArray() {
    return this.landingPageForm.get("whoItsFor") as FormArray;
  }

  addWhoItsForItem(id?: number) {
    this.whoItsForArray.push(this.createWhoItsForItem(id));
  }

  removeWhoItsForItem(index: number) {
    if (index > 0)
      this.whoItsForArray.removeAt(index);
  }

  get faqArray() {
    return this.landingPageForm.get("faq") as FormArray;
  }

  addFaqItem(id?: number) {
    this.faqArray.push(this.createFaqItem(id));
  }

  removeFaqItem(index: number) {
    if (index > 0)
      this.faqArray.removeAt(index);
  }



  // File upload handling - optimized to use a more functional approach
  onFileUpload(event: any, controlName: string, formGroupPath?: string, formArrayName?: string, formArrayIndex?: number) {
    if (!event.files || event.files.length === 0) return;

    const file = event.files[0];

    // Remove any previous upload with the same control path
    this.removeExistingFile(controlName, formGroupPath, formArrayName, formArrayIndex);

    // Store the file for later submission
    this.uploadedFiles.push({
      file,
      controlName,
      formGroupPath,
      formArrayName,
      formArrayIndex
    });

    // Update the form control with the file name for display
    if (formArrayName && formArrayIndex !== undefined) {
      const formArray = this.landingPageForm.get(formArrayName) as FormArray;
      formArray.at(formArrayIndex).get(controlName)?.setValue(file.name);
    } else {
      this.landingPageForm.get(controlName)?.setValue(file.name);
    }

    this.files = [];
    // this.fileInput.nativeElement.value = '';
    // // Reset the file input
    // if (this.fileInput && this.fileInput.nativeElement) {
    //   this.fileInput.nativeElement.value = '';
    // }
  }

  // Helper to remove existing file uploads with the same control path
  removeExistingFile(controlName: string, formGroupPath?: string, formArrayName?: string, formArrayIndex?: number) {
    const index = this.uploadedFiles.findIndex(file =>
      file.controlName === controlName &&
      file.formGroupPath === formGroupPath &&
      file.formArrayName === formArrayName &&
      file.formArrayIndex === formArrayIndex
    );

    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  // Helper method to check if a control is invalid and touched
  isInvalid(controlName: string, formGroupPath?: string): boolean {
    let control;
    if (formGroupPath) {
      control = this.landingPageForm.get(formGroupPath)?.get(controlName);
    } else {
      control = this.landingPageForm.get(controlName);
    }
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  // Helper method for form array validation
  isArrayControlInvalid(formArrayName: string, index: number, controlName: string): boolean {
    const formArray = this.landingPageForm.get(formArrayName) as FormArray;
    const control = formArray.at(index).get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  // Format form data according to backend validation structure - optimized to handle IDs
  formatFormDataForBackend(formData: FormData) {
    const data = this.landingPageForm.value;
    // If editing an existing landing page, include the ID
    if (this.id) {
      formData.append('id', this.id);
    }

    // Basic fields
    formData.append('feature_name', data.feature_name);
    formData.append('featureUrlSlug', data.featureUrlSlug);
    formData.append('category', data.category);
    formData.append('tag', data.tag);
    formData.append('icon', data.icon);
    formData.append('order_no', data.order_no);
    formData.append('description', data.description);
    formData.append('status', data.status);

    // SEO section
    formData.append('seo_title', data.seo_title);
    formData.append('meta_description', data.meta_description);
    formData.append('meta_tag', data.meta_tag || '');
    formData.append('meta_author', data.meta_author || '');
    formData.append('seo_status', data.seo_status);

    // Hero section
    formData.append('hero_title', data.hero_title);
    formData.append('video_link', data.video_link || '');
    formData.append('hero_description', data.hero_description);

    // Why Choose Us section - include IDs for existing items
    if (data.chooseus && data.chooseus.length > 0) {
      data.chooseus.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`chooseus[${index}][id]`, item.id);
        }
        formData.append(`chooseus[${index}][chooseus_icon]`, item.chooseus_icon);
        formData.append(`chooseus[${index}][chooseus_title]`, item.chooseus_title);
        formData.append(`chooseus[${index}][chooseus_subtitle]`, item.chooseus_subtitle);
      });
    }

    // How It Works section - include IDs for existing items
    if (data.howItWorks && data.howItWorks.length > 0) {
      data.howItWorks.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`howItWorks[${index}][id]`, item.id);
        }
        formData.append(`howItWorks[${index}][step]`, item.step);
        formData.append(`howItWorks[${index}][itswork_title]`, item.itswork_title);
        formData.append(`howItWorks[${index}][itswork_subtitle]`, item.itswork_subtitle);
      });
    }

    // Who It's For section - include IDs for existing items
    if (data.whoItsFor && data.whoItsFor.length > 0) {
      data.whoItsFor.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`whoItsFor[${index}][id]`, item.id);
        }
        formData.append(`whoItsFor[${index}][itsfor_title]`, item.itsfor_title);
        formData.append(`whoItsFor[${index}][itsfor_subtitle]`, item.itsfor_subtitle);
      });
    }

    // FAQ section - include IDs for existing items
    if (data.faq && data.faq.length > 0) {
      data.faq.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`faq[${index}][id]`, item.id);
        }
        formData.append(`faq[${index}][question]`, item.question);
        formData.append(`faq[${index}][answer]`, item.answer);
      });
    }

    // Now add all files with their corresponding field names
    this.uploadedFiles.forEach((fileUpload) => {
      if (fileUpload.formArrayName && fileUpload.formArrayIndex !== undefined) {
        // For array items with files
        const fieldName = `${fileUpload.formArrayName}[${fileUpload.formArrayIndex}][${fileUpload.controlName}]`;
        formData.append(fieldName, fileUpload.file);
      } else {
        // For simple file fields
        formData.append(fileUpload.controlName, fileUpload.file);
      }
    });

    return formData;
  }

  saveDraft() {
    this.submitted = true;

    if (this.landingPageForm.valid) {
      const formData = new FormData();
      this.formatFormDataForBackend(formData);
      formData.append('keyword', 'Draft');
      // Send to backend
      if (this.id) {
      // Update existing landing page
        this.landingPageService.editLandingPageData(formData).subscribe(
          (response) => {
            if (response.success) {
              this.toastService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message
              });
            } else {
              this.toastService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message
              });
            }
            this.submitted = false;
          },
          (error) => {
            console.error("Error saving draft", error);
            this.submitted = false;
          }
        );
      }
    }
    else {
      this.markFormGroupTouched(this.landingPageForm);
    }
  }

  addLandingPage() {
    this.submitted = true;
    if (this.landingPageForm.valid) {
      const formData = new FormData();
      this.formatFormDataForBackend(formData);

      if (this.id) {
      // Update existing landing page
        this.landingPageService.editLandingPageData(formData).subscribe(
          (response) => {
            if (response.success) {
              this.toastService.add({
                severity: 'success',
                summary: 'Landing page updated successfully'
              });
              this.router.navigate(['/landing-page']);
              this.submitted = false;
            } else {
              this.toastService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message
              });
            }
          },
          (error) => {
            this.toastService.add({
              severity: 'error',
              summary: error.error.message
            });
            this.submitted = false;
          }
        );
      } else {
        // Create new landing page
        this.landingPageService.editLandingPageData(formData).subscribe(
          (response) => {
            this.submitted = false;
            if (response.success) {
              this.toastService.add({
                severity: 'success',
                summary: 'Landing page added successfully'
              });
              this.landingPageForm.reset();
              this.router.navigate(['/landing-page']);
            }
          },
          (error) => {
            console.error("Error adding landing page", error);
            this.submitted = false;
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.landingPageForm);
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    let errorShown = false;

    const markControlsAsTouched = (fg: FormGroup) => {
      Object.values(fg.controls).forEach((control) => {
        control.markAsTouched();

        if (control instanceof FormGroup) {
          markControlsAsTouched(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach((item) => {
            if (item instanceof FormGroup) {
              markControlsAsTouched(item);
            }
          });
        }
      });
    };

    // Mark all controls as touched
    markControlsAsTouched(formGroup);

    // Show error toast only once after all controls are processed
    if (formGroup.invalid && !errorShown) {
      errorShown = true;
      this.toastService.add({
        severity: 'error',
        summary: 'Please fill all required fields'
      });
    }
  }

  onCategoryChange(id: any) {
    if (id) {
      this.landingPageService.getLandingCategoryTags(id).subscribe({
        next: response => {
          if (response.success) {
            this.tagList = response.tags;
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  getLandingPageById(slug: string) {
    this.landingPageService.getLandingPageById({ slug: slug }).subscribe(
      (response: any) => {
        if (response.success) {
          // this.landingPageId = response.id;
          this.id = response.landingpages.id
          this.patchFormValues(response.landingpages);
        }
      },
      (error) => {
        console.error("Error fetching landing page data", error);
      }
    );
  }

  // Method to patch form values from API response - optimized to preserve IDs
  patchFormValues(data: LandingPage) {
    this.resetFormArrays();
    this.landingPageForm.patchValue({
      feature_name: data.feature_name,
      featureUrlSlug: data.feature_name.toLowerCase().replace(/\s+/g, '-'),
      category: data.category,
      tag: data.tag,
      icon: data.icon,
      order_no: data.order_no,
      description: data.description,
      status: data.status
    });

    // Patch SEO section if available
    if (data.seo) {
      this.landingPageForm.patchValue({
        seo_title: data.seo.seo_title,
        meta_description: data.seo.meta_description,
        meta_tag: data.seo.meta_tag || '',
        meta_author: data.seo.meta_author || '',
        seo_status: data.seo.seo_status,
        image: data.seo.image || ''
      });
    }

    // Patch hero section if available
    if (data.herocover) {
      this.landingPageForm.patchValue({
        hero_title: data.herocover.hero_title,
        video_link: data.herocover.video_link || '',
        hero_description: data.herocover.hero_description,
        hero_coverimage: data.herocover.hero_coverimage || ''
      });
    }

    // Patch choose us items - preserve IDs
    if (data.chooseuses && data.chooseuses.length > 0) {
      data.chooseuses.forEach((item: any, index) => {
        const newItem = this.createChooseUsItem(item.id); // Pass ID to the form group
        newItem.patchValue({
          chooseus_icon: item.chooseus_icon,
          chooseus_title: item.chooseus_title,
          chooseus_subtitle: item.chooseus_subtitle,
          chooseus_cardimage: item.chooseus_cardimage || ''
        });
        this.chooseUsArray.push(newItem);
      });
    }

    // Patch how it works items - preserve IDs
    if (data.howitsworks && data.howitsworks.length > 0) {
      data.howitsworks.forEach((item, index) => {

        const newItem = this.createHowItWorksItem(item.id); // Pass ID to the form group
        newItem.patchValue({
          step: item.step,
          itswork_title: item.itswork_title,
          itswork_subtitle: item.itswork_subtitle,
          itswork_cardimage: item.itswork_cardimage || '',
          feature_image: item.feature_image || ''
        });
        this.howItWorksArray.push(newItem);
      });
    }

    // Patch who it's for items - preserve IDs
    if (data.whoitsfors && data.whoitsfors.length > 0) {
      data.whoitsfors.forEach((item, index) => {
        // Add new items as needed with their IDs
        const newItem = this.createWhoItsForItem(item.id); // Pass ID to the form group
        newItem.patchValue({
          itsfor_title: item.itsfor_title,
          itsfor_subtitle: item.itsfor_subtitle,
          itsfor_cardimage: item.itsfor_cardimage || ''
        });
        this.whoItsForArray.push(newItem);
      });
    }

    // Patch FAQ items - preserve IDs
    if (data.faqs && data.faqs.length > 0) {
      data.faqs.forEach((item, index) => {
        // Add new items as needed with their IDs
        const newItem = this.createFaqItem(item.id); // Pass ID to the form group
        newItem.patchValue({
          question: item.question,
          answer: item.answer
        });
        this.faqArray.push(newItem);
      });
    }
    console.log({ data: this.landingPageForm.value })
    this.originalFormValue = this.landingPageForm.value;
  }

  getDropDownList() {
    this.landingPageService.getDropDownList().subscribe({
      next: response => {
        this.categories = response.categories;
        this.statusOptions = response.seo_status;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  resetFormArrays() {
    // Keep only the first item in each array and reset it
    while (this.chooseUsArray.length > 0) {
      this.chooseUsArray.removeAt(0);
    }

    while (this.howItWorksArray.length > 0) {
      this.howItWorksArray.removeAt(0);
    }

    while (this.whoItsForArray.length > 0) {
      this.whoItsForArray.removeAt(0);
    }

    while (this.faqArray.length > 0) {
      this.faqArray.removeAt(0);
    }
  }

  emojiValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      return this.emojiRegex.test(control.value) ? null : { invalidEmoji: true };
    };
  }
}