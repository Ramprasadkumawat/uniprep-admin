import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SelectModule} from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { FaqCatService } from '../../faq-cat/faq-cat.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'uni-addblogs',
    templateUrl: './addblogs.component.html',
    styleUrls: ['./addblogs.component.scss'],
    imports: [
        CommonModule, InputTextModule, SelectModule,
        TextareaModule, ReactiveFormsModule, MultiSelectModule, EditorModule, FormsModule
    ]
})
export class AddblogsComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  textMessage: any = "";
  modules: any;
  blogId: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  isMessageValid = false;
  categorieslist = [];
  tagslist = [];
  statuses: any[] = [];
  onlyEditTimeEnable: boolean = true;
  blogtitle: any = "New Blog Post"
  blogButtonTitle:any="Add Blog Post"
  constructor(private router: Router, private fb: FormBuilder, private service: FaqCatService,
    private route: ActivatedRoute, private toastr: MessageService, private cdr: ChangeDetectorRef
  ) {
    this.form = fb.group({
      title: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      categories: ["", [Validators.required]],
      tags: ["", [Validators.required]],
      seotitle: ["", [Validators.required]],
      metades: ["", [Validators.required]],
      metatags: ["", [Validators.required]],
      metaauthor: ["", [Validators.required]],
      image: [''],
      status: [1, [Validators.required]],
      textmessage: [""],
      id: [],
    })
    this.modules = {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ["clean"], // remove formatting button
          ["link", "image", "video"], // link and image, video
          // ["fullscreen"],
        ],
      },
    };
  }

  ngOnInit(): void {
    var data={
        perpage : 1000000,
        page : 1,
    }
    this.service.getBlogCategories(data).subscribe((response) => {
      this.categorieslist = [];
      this.categorieslist = response.categories;
    })
    this.service.getBlogTags(data).subscribe((response) => {
      this.tagslist = [];
      this.tagslist = response.categories;
    })
    this.statuses = [{ name: "Active", id: 1 }, { name: "Inactive", id: 0 }]
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.blogId = id;
        this.getBlogs();
        this.onlyEditTimeEnable = false;
      } else {
      }
    });
  }
  imageForEdit:any="";
  imageFile:any="";
  getBlogs() {
    this.blogtitle = "Update Blog Post"
    this.blogButtonTitle="Update Blog Post"
    var data = {
      id: this.blogId
    }
    this.service.getBlogs(data).subscribe((response: any) => {
      const tagid = parseInt(response.blogs[0].tags);
      this.form.patchValue({
        title: response.blogs[0].title,
        slug: response.blogs[0].slug,
        categories: [response.blogs[0].blog_categories_id],
        tags: [tagid],
        seotitle: response.blogs[0].seo_title,
        metades: response.blogs[0].meta_description,
        metatags: response.blogs[0].meta_tags,
        metaauthor: response.blogs[0].meta_author,
        status: response.blogs[0].status,
        textmessage: response.blogs[0].content,
        id: response.blogs[0].id,
      })
      const plainText = this.form.value.textmessage?.trim(); // Quill gives you plain text here!
      this.isMessageValid = !!plainText;
      // this.imageForEdit = response.blogs[0].featured_img.split('/')
      this.imageFile=response.blogs[0].featured_img      
      this.imageEditPath()
    })
  }
  imageEditPath(){
    const url = this.imageFile;  // Use the URL from API
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1]; // Correct filename extraction
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], filename, {
          type: blob.type,
          lastModified: new Date().getTime()
        });
        this.document = file
        this.form.controls.image.setValue(this.document); // Patch file directly to FormControl
      })
      .catch(error => {
        console.error('Error fetching the file:', error);
      });
  }
  onEditorChange(event: any) {
    const plainText = event.textValue?.trim(); // Quill gives you plain text here!
    this.isMessageValid = !!plainText;
  }
  get f() {
    return this.form.controls;
  }
  goBack() {
    this.router.navigate(['blogs']);
  }
  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.blogtitle == "New Blog Post") {
      var data = {
        title: this.form.value.title,
        slug: this.form.value.slug,
        featured_img: this.document,
        blog_categories_id: this.form.value.categories,
        tags: this.form.value.tags,
        seo_title: this.form.value.seotitle,
        meta_description: this.form.value.metades,
        meta_tags: this.form.value.metades,
        meta_author: this.form.value.metaauthor,
        content: this.form.value.textmessage,
        status: this.form.value.status,
      }
      this.service.addBlogs(data).subscribe((res) => {
        if (res) {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.ngOnInit()
          this.form.reset()
          this.submitted = false;
          this.textMessage = "";
          this.document = "";
          this.form.patchValue({
            status:1
          })
        }
      })
    } else {
      var data1 = {
        title: this.form.value.title,
        slug: this.form.value.slug,
        featured_img: this.document,
        blog_categories_id: this.form.value.categories,
        tags: this.form.value.tags,
        seo_title: this.form.value.seotitle,
        meta_description: this.form.value.metades,
        meta_tags: this.form.value.metades,
        meta_author: this.form.value.metaauthor,
        content: this.form.value.textmessage,
        status: this.form.value.status,
        id: this.form.value.id
      }      
      this.service.updateBlogs(data1).subscribe((res) => {
        if (res) {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.submitted = false;
          this.textMessage = "";
          this.document = ""
          this.router.navigate(['blogs']);
        }
      })
    }

  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  selectedFile: File | undefined;
  document: any;
  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.document = file;
      const fileInput = this.fileInput.nativeElement;
    }
    this.form.controls.image.setValue(this.document);
  }
  saveDraft() {
    if (this.blogtitle == "New Blog Post") {
    var data = {
      title: this.form.value.title,
      slug: this.form.value.slug,
      featured_img: this.document,
      blog_categories_id: this.form.value.categories,
      tags: this.form.value.tags,
      seo_title: this.form.value.seotitle,
      meta_description: this.form.value.metades,
      meta_tags: this.form.value.metades,
      meta_author: this.form.value.metaauthor,
      status: 2,
      content: this.form.value.textmessage
    }
      this.service.saveDraft(data).subscribe((res) => {
        if (res) {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.form.reset()
          this.submitted = false;
          this.document = ""
          this.textMessage = "";
          this.router.navigate(['blogs']);
        }
      })
    }else{
      var data1 = {
        title: this.form.value.title,
        slug: this.form.value.slug,
        featured_img: this.document,
        blog_categories_id: this.form.value.categories,
        tags: this.form.value.tags,
        seo_title: this.form.value.seotitle,
        meta_description: this.form.value.metades,
        meta_tags: this.form.value.metades,
        meta_author: this.form.value.metaauthor,
        content: this.form.value.textmessage,
        status: 2,
        id: this.form.value.id
      }
      this.service.updateBlogs(data1).subscribe((res) => {
        if (res) {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.submitted = false;
          this.textMessage = "";
          this.document = ""
          this.router.navigate(['blogs']);
        }
      })
    }

  }

}

