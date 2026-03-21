import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { LandingPageService } from "../landing-page.service";
import { Category } from "src/app/@Models/landing-page.model";

interface FileUpload {
  file: File;
  controlName: string;
  formGroupPath?: string;
  formArrayName?: string;
  formArrayIndex?: number;
}

@Component({
    selector: "app-category-editor",
    templateUrl: "./category-editor.component.html",
    styleUrls: ["./category-editor.component.scss"],
    standalone: false
})
export class CategoryEditorComponent implements OnInit {
  categoryForm: FormGroup;
  @ViewChild('fileUpload') fileInput: ElementRef;
  id: number = NaN;
  categories: any[] = [];
  statusOptions = [
    { id: 1, status: 'Active' },
    { id: 2, status: 'Inactive' }
  ];
  uploadedFiles: FileUpload[] = [];
  originalFormValue: any;
  submitted = false;
  files: any = [];
  
  // Add emoji regex for validation
  private emojiRegex = /^(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)+$/u;

  constructor(private fb: FormBuilder, private router: Router, private categoryService: LandingPageService, private route: ActivatedRoute, private toastService: MessageService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getDropDownList();
  }

  getDropDownList() {
    this.categoryService.getDropDownList().subscribe({
      next: response => {
        this.categories = response.categories;
        this.statusOptions = response.seo_status;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      category_name: ["", [Validators.required, Validators.maxLength(1000)]],
      page_title: ["", [Validators.required, Validators.maxLength(1000)]],
      page_description: ["", [Validators.required, Validators.maxLength(1000)]],
      
      seo_title: ["", [Validators.required, Validators.maxLength(1000)]],
      meta_description: ["", [Validators.required, Validators.maxLength(1000)]],
      meta_tag: ["", Validators.maxLength(1000)],
      meta_author: ["", Validators.maxLength(1000)],
      seo_status: [1, [Validators.required]],
      image: [""],
      
      category_title: ["", [Validators.required, Validators.maxLength(1000)]],
      category_icon: ["", [Validators.required]],
      category_description: ["", [Validators.required, Validators.maxLength(1000)]],
      
      categoryCards: this.fb.array([]),
      
      tagCards: this.fb.array([]),
      // Status
      status: [1, Validators.required],
    });
    
    this.addCategoryCard();
    this.addTagCard();
  }

  // Helper methods to create form groups
  createCategoryCard(id?: number) {
    return this.fb.group({
      id: [id || null],
      icon_emoji: ["", [Validators.required, this.emojiValidator()]], // this.emojiValidator()
      title: ["", [Validators.required]],
      sub_title: ["", [Validators.required]],
    });
  }

  createTagCard(id?: number) {
    return this.fb.group({
      id: [id || null],
      icon_emoji: ["", [Validators.required, this.emojiValidator()]], //, 
      title: ["", [Validators.required]],
      sub_title: ["", [Validators.required]],
    });
  }


  emojiValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      return this.emojiRegex.test(control.value) ? null : { invalidEmoji: true };
    };
  }

  // Methods to add/remove items to form arrays
  get categoryCardsArray() {
    return this.categoryForm.get("categoryCards") as FormArray;
  }

  get tagCardsArray() {
    return this.categoryForm.get("tagCards") as FormArray;
  }

  addCategoryCard(id?: number) {
    this.categoryCardsArray.push(this.createCategoryCard(id));
  }

  removeCategoryCard(index: number) {
    this.categoryCardsArray.removeAt(index);
  }

  addTagCard(id?: number) {
    this.tagCardsArray.push(this.createTagCard(id));
  }

  removeTagCard(index: number) {
    this.tagCardsArray.removeAt(index);
  }

  onChangeCategory(category: any) {
    this.id = category.value;
    this.categoryService.getCategoryById({id: this.id}).subscribe(
      (response) => {
        if (response.success) {
          this.patchFormValues(response.category)
        } 
      },
      (error) => {
        console.error("Error saving draft", error);
        this.submitted = false;
      }
    );
  }

  // File upload handling
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
      const formArray = this.categoryForm.get(formArrayName) as FormArray;
      formArray.at(formArrayIndex).get(controlName)?.setValue(file.name);
    } else {
      this.categoryForm.get(controlName)?.setValue(file.name);
    }

    this.files = [];
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
      control = this.categoryForm.get(formGroupPath)?.get(controlName);
    } else {
      control = this.categoryForm.get(controlName);
    }
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  // Helper method for form array validation
  isArrayControlInvalid(formArrayName: string, index: number, controlName: string): boolean {
    const formArray = this.categoryForm.get(formArrayName) as FormArray;
    const control = formArray.at(index).get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  // Format form data according to backend validation structure
  formatFormDataForBackend(formData: FormData) {
    const data = this.categoryForm.value;
    // If editing an existing category, include the ID
    if (this.id) {
      formData.append('id', this.id.toString());
    }

    // Basic fields
    formData.append('category_name', data.category_name);
    formData.append('page_title', data.page_title);
    formData.append('page_description', data.page_description);
    formData.append('status', data.status);

    // SEO section
    formData.append('seo_title', data.seo_title);
    formData.append('meta_description', data.meta_description);
    formData.append('meta_tag', data.meta_tag || '');
    formData.append('meta_author', data.meta_author || '');
    formData.append('seo_status', data.seo_status);

    // Category info
    formData.append('category_title', data.category_title);
    formData.append('category_emoji', data.category_icon);
    formData.append('category_description', data.category_description);

    // Category cards
    if (data.categoryCards && data.categoryCards.length > 0) {
      data.categoryCards.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`categorycards[${index}][id]`, item.id);
          formData.append(`categorycards[${index}][category_icon]`, item.icon_emoji);
          formData.append(`categorycards[${index}][category_title]`, item.title);
          formData.append(`categorycards[${index}][category_subtitle]`, item.sub_title);
        } else {
          formData.append(`categorycards[${index}][category_icon]`, item.icon_emoji);
          formData.append(`categorycards[${index}][category_title]`, item.title);
          formData.append(`categorycards[${index}][category_subtitle]`, item.sub_title);
        }
      });
    }

    //tags 
    if (data.tagCards && data.tagCards.length > 0) {
      data.tagCards.forEach((item: any, index: number) => {
        // Include ID if it exists
        if (item.id) {
          formData.append(`tags[${index}][id]`, item.id);
          formData.append(`tags[${index}][tag_icon]`, item.icon_emoji);
          formData.append(`tags[${index}][tag_title]`, item.title);
          formData.append(`tags[${index}][tag_subtitle]`, item.sub_title);
        } else {
          formData.append(`tags[${index}][tag_icon]`, item.icon_emoji);
          formData.append(`tags[${index}][tag_title]`, item.title);
          formData.append(`tags[${index}][tag_subtitle]`, item.sub_title);
        }
      });
    }

    // Add files
    this.uploadedFiles.forEach((fileUpload) => {
      formData.append(fileUpload.controlName, fileUpload.file);
    });

    return formData;
  }


  updateCategory() {
    this.submitted = true;
    if (this.categoryForm.valid) {
      const formData = new FormData();
      this.formatFormDataForBackend(formData);

      if (this.id) {
        // Update existing category
        this.categoryService.editCategoryData(formData).subscribe(
          (response) => {
            if (response.success) {
              this.toastService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category updated successfully'
              });
              this.router.navigate(['/landing-page']);
            }
            this.submitted = false;
          },
          (error) => {
            console.error("Error updating category", error);
            this.submitted = false;
          }
        );
      } else {
        // Create new category
        this.categoryService.addCategoryData(formData).subscribe(
          (response) => {
            this.submitted = false;
            if (response.success) {
              this.toastService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category added successfully'
              });
              this.router.navigate(['/landing-page']);
            }
          },
          (error) => {
            console.error("Error adding category", error);
            this.submitted = false;
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.categoryForm);
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

  getCategoryById(id: string) {
    this.categoryService.getCategoryById({ id: id }).subscribe(
      (response: any) => {
        if (response.success) {
          this.patchFormValues(response.category);
        }
      },
      (error) => {
        console.error("Error fetching category data", error);
      }
    );
  }

  patchFormValues(data: any) {
    this.resetFormArrays();
    this.categoryForm.reset();
    this.id = data.id;
    // SEO
    if (data.seos) {
      this.categoryForm.patchValue({
        seo_title: data.seos.seo_title,
        meta_description: data.seos.meta_description,
        meta_tag: data.seos.meta_tag || '',
        meta_author: data.seos.meta_author || '',
        seo_status: data.seos.seo_status,
        image: data.seos.image || ''
      });
    }

    // Category info
    this.categoryForm.patchValue({
      category_title: data.category_title,
      category_description: data.category_description,
      category_name: data.id, // Using the category name field
      page_title: data.page_title,
      page_description: data.page_description,
      category_icon: data.category_emoji,
      status: data.status
    });

    // Process cards
    if (data.cards && data.cards.length > 0) {
      data.cards.forEach(card => {
        const newCard = this.createCategoryCard(card.id);
        newCard.patchValue({
          icon_emoji: card.category_icon,
          title: card.category_title,
          sub_title: card.category_subtitle
        });
        this.categoryCardsArray.push(newCard);
      });
    }
    // Process tags
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => {
        const newTag = this.createTagCard(tag.id); // Assuming you use the same method for tags
        newTag.patchValue({
          icon_emoji: tag.tag_icon,
          title: tag.tag_title,
          sub_title: tag.tag_subtitle
        });
        this.tagCardsArray.push(newTag); // Or a different array if you have one for tags
      });
    }
    this.originalFormValue = this.categoryForm.value;
  }

  resetFormArrays() {
    while (this.categoryCardsArray.length > 0) {
      this.categoryCardsArray.removeAt(0);
    }
    while (this.tagCardsArray.length > 0) {
      this.tagCardsArray.removeAt(0);
    }
  }
}