import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AccordionModule } from "primeng/accordion";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from "primeng/paginator";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { FaqCatService } from "../faq-cat/faq-cat.service";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "uni-blogsadmin",
	templateUrl: "./blogsadmin.component.html",
	styleUrls: ["./blogsadmin.component.scss"],
	imports: [CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, TextareaModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, PaginatorModule, DialogModule, MultiSelectModule, ConfirmPopupModule],
	providers: [ConfirmationService],
})
export class BlogsadminComponent implements OnInit {
	filterForm: FormGroup;
	categoryForm: FormGroup;
	tagForm: FormGroup;
	categorieslist: any[] = [];
	tagslistdrop: any[] = [];
	statuses: any[] = [];
	totalcount: number = 0;
	totacategory: number = 0;
	totaltags: number = 0;
	confirmationpopup: boolean = false;
	confirmationpopupTag: boolean = false;
	selectAllCheckboxes: boolean = false;
	selectAllCheckboxesTag: boolean = false;
	submitted: boolean = false;
	submittedtag: boolean = false;
	categories: any[] = [];
	tagsList = [];
	catNameTitle = "Add Category";
	tagNameTitle = "Add Tag";
	blogsList: any[] = [];
	selectedCheckboxIds: any[];
	constructor(private fb: FormBuilder, private router: Router, private service: FaqCatService, private toastr: MessageService, private confirmationService: ConfirmationService) {
		this.filterForm = fb.group({
			searchblogs: [""],
			date: [""],
			categories: [""],
			tags: [""],
			status: [""],
		});
		this.categoryForm = fb.group({
			Category: ["", [Validators.required]],
			color: ["#848EC1", [Validators.required]],
			id: [""],
		});
		this.tagForm = fb.group({
			tag: ["", [Validators.required]],
			id: [""],
		});
	}

	ngOnInit(): void {
		this.statuses = [
			{ name: "Active", id: 1 },
			{ name: "Inactive", id: 0 },
			{ name: "Draft", id: 2 },
		];
		var catdrop = {
			perpage: 1000000,
			page: 1,
		};
		this.service.getBlogCategories(catdrop).subscribe((response) => {
			this.categorieslist = [];
			this.categorieslist = response.categories;
		});
		this.service.getBlogTags(catdrop).subscribe((response) => {
			this.tagslistdrop = [];
			this.tagslistdrop = response.categories;
		});
		var data = {
			perpage: this.perPage,
			page: 1,
		};
		this.getBlogs(data);
		var catdata = {
			perpage: this.pageSize,
			page: 1,
		};
		this.categoryList(catdata);
		var tagdata = {
			perpage: this.pageSizeTag,
			page: 1,
		};
		this.tagList(tagdata);
	}
	categoryList(data: any) {
		this.service.getBlogCategories(data).subscribe((response) => {
			this.categories = [];
			this.categories = response.categories;
			this.totacategory = response.count;
		});
	}
	tagList(data: any) {
		this.service.getBlogTags(data).subscribe((response) => {
			this.tagsList = [];
			this.tagsList = response.categories;
			this.totaltags = response.count;
		});
	}
	getBlogs(data: any) {
		this.service.getBlogs(data).subscribe((response: any) => {
			this.blogsList = [];
			this.blogsList = response.blogs;
			this.totalcount = response.total;
		});
	}
	submitFilterForm() {
		let data = {
			perpage: this.perPage,
			page: 1,
			searchblogs: this.filterForm.value.searchblogs,
			date: this.filterForm.value.date,
			categories: this.filterForm.value.categories,
			tags: this.filterForm.value.tags,
			status: this.filterForm.value.status,
		};
		this.getBlogs(data);
	}
	reset() {
		this.filterForm.reset();
		var data = {
			perpage: this.perPage,
			page: 1,
		};
		this.getBlogs(data);
	}
	pageno: number = 1;
	perPage: number = 8;
	paginate(event: any) {
		this.pageno = (event.page ?? 0) + 1; 
		this.perPage = event.rows ?? 10;
		let data = {
			perpage: this.perPage,
			page: event.page + 1,
			searchblogs: this.filterForm.value.searchblogs,
			date: this.filterForm.value.date,
			categories: this.filterForm.value.categories,
			tags: this.filterForm.value.tags,
			status: this.filterForm.value.tags,
		};
		this.getBlogs(data);
	}

	// category pop-up
	newCategoryPopUp() {
		this.confirmationpopup = true;
	}
	closeCategoryPopUp() {
		this.confirmationpopup = false;
	}
	get f() {
		return this.categoryForm.controls;
	}
	submitCategoryForm() {
		this.submitted = true;
		if (this.categoryForm.invalid) {
			return;
		}
		if (this.catNameTitle == "Add Category") {
			var data = {
				category: this.categoryForm.value.Category,
				colourcode: this.categoryForm.value.color,
			};
			this.service.addCategories(data).subscribe((response) => {
				this.toastr.add({
					severity: "success",
					summary: "Success",
					detail: response.message,
				});
				this.submitted = false;
				this.categoryForm.reset();
				this.ngOnInit();
			});
		} else {
			var data1 = {
				category: this.categoryForm.value.Category,
				colourcode: this.categoryForm.value.color,
				id: this.categoryForm.value.id,
			};
			this.service.upadateCategories(data1).subscribe((response) => {
				this.toastr.add({
					severity: "success",
					summary: "Success",
					detail: response.message,
				});
				this.submitted = false;
				this.categoryForm.reset();
				this.ngOnInit();
			});
		}
	}
	pageSize: number = 10;
	page: number = 1;
	pageChange(event: any) {
		this.page = (event.page ?? 0) + 1;
		this.pageSize = event.rows;
		let data = {
			perpage: this.pageSize,
			page: event.page + 1,
		};
		this.categoryList(data);
	}
	editCategory(cat: any) {
		this.catNameTitle = "Update";
		this.categoryForm.patchValue({
			Category: cat.category,
			color: cat.colourcode,
			id: cat.id,
		});
	}
	selectAllCheckbox() {
		this.selectAllCheckboxes = !this.selectAllCheckboxes;
		if (this.selectAllCheckboxes) {
			this.categories.forEach((item) => {
				item.isChecked = 1;
			});
		} else {
			this.categories.forEach((item) => {
				item.isChecked = 0;
			});
		}
	}
	deleteSelected(): void {
		this.selectedCheckboxIds = [];
		this.categories.forEach((item) => {
			if (item.isChecked == 1) {
				this.selectedCheckboxIds.push(item.id);
			}
		});
		if (this.selectedCheckboxIds.length != 0) {
			this.confirmationService.confirm({
				target: event.target as EventTarget,
				message: "Are you sure that you want to delete?",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.service.deleteCategory(this.selectedCheckboxIds).subscribe((responce) => {
						this.toastr.add({ severity: responce.status, summary: responce.status, detail: responce.message });
						this.ngOnInit();
						this.selectedCheckboxIds = [];
					});
				},
				reject: () => {
					this.toastr.add({ severity: "error", summary: "Rejected", detail: "You have rejected" });
				},
			});
		} else {
			this.toastr.add({ severity: "error", summary: "Rejected", detail: "Please select Atleast one row." });
		}
	}
	// tags pop up
	get t() {
		return this.tagForm.controls;
	}
	newTagPopUp() {
		this.confirmationpopupTag = true;
	}
	pageSizeTag: number = 10;
	pagetag: number = 1;
	pageChangetags(event: any) {
		this.pagetag = event.page + 1;
		this.pageSizeTag = event.rows;
		let data = {
			perpage: this.pageSizeTag,
			page: event.page + 1,
		};
		this.tagList(data);
	}
	editTags(eve: any) {
		this.tagNameTitle = "Update";
		this.tagForm.patchValue({
			tag: eve.tag_name,
			id: eve.id,
		});
	}
	selectAllCheckboxTag() {
		this.selectAllCheckboxesTag = !this.selectAllCheckboxesTag;
		if (this.selectAllCheckboxesTag) {
			this.tagsList.forEach((item) => {
				item.isChecked = 1;
			});
		} else {
			this.tagsList.forEach((item) => {
				item.isChecked = 0;
			});
		}
	}
	deleteSelectedTag() {
		this.selectedCheckboxIds = [];
		this.tagsList.forEach((item) => {
			if (item.isChecked == 1) {
				this.selectedCheckboxIds.push(item.id);
			}
		});
		if (this.selectedCheckboxIds.length != 0) {
			this.confirmationService.confirm({
				target: event.target as EventTarget,
				message: "Are you sure that you want to delete?",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.service.deleteTags(this.selectedCheckboxIds).subscribe((responce) => {
						this.toastr.add({ severity: responce.status, summary: responce.status, detail: responce.message });
						this.ngOnInit();
						this.selectedCheckboxIds = [];
					});
				},
				reject: () => {
					this.toastr.add({ severity: "error", summary: "Rejected", detail: "You have rejected" });
				},
			});
		} else {
			this.toastr.add({ severity: "error", summary: "Rejected", detail: "Please select Atleast one row." });
		}
	}
	submitTagForm() {
		this.submittedtag = true;
		if (this.tagForm.invalid) {
			return;
		}
		if (this.tagNameTitle == "Add Tag") {
			var data = {
				tag_name: this.tagForm.value.tag,
			};
			this.service.addTag(data).subscribe((response) => {
				this.toastr.add({
					severity: "success",
					summary: "Success",
					detail: response.message,
				});
				this.submittedtag = false;
				this.tagForm.reset();
				this.ngOnInit();
			});
		} else {
			var data1 = {
				tag_name: this.tagForm.value.tag,
				id: this.tagForm.value.id,
			};
			this.service.upadateTag(data1).subscribe((response) => {
				this.toastr.add({
					severity: "success",
					summary: "Success",
					detail: response.message,
				});
				this.submittedtag = false;
				this.tagForm.reset();
				this.ngOnInit();
			});
		}
	}
	// add blogs
	addBlogs() {
		this.router.navigate(["addblogs"]);
	}
	getStatusLabel(status: number): string {
		switch (status) {
			case 1:
				return "Blog Active";
			case 0:
				return "Blog InActive";
			case 2:
				return "Draft";
			default:
				return "Unknown";
		}
	}

	getStatusColor(status: number): string {
		switch (status) {
			case 1:
				return "#8BC246";
			case 0:
			case 2:
				return "#EE0000";
			default:
				return "#EE0000";
		}
	}
	editBlogsList(id: any) {
		this.router.navigate(["addblogs", id]);
	}
	// innerhtml minimum words shown
	getHTMLPreview(inputHtml: string, wordLimit: number = 60): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(inputHtml, "text/html");
		let wordCount = 0;
		let output = "";

		function walkNodes(node: ChildNode | null): string {
			if (!node || wordCount >= wordLimit) return "";

			if (node.nodeType === Node.TEXT_NODE) {
				const words = node.textContent?.trim().split(/\s+/) || [];
				const remaining = wordLimit - wordCount;
				const take = words.slice(0, remaining);
				wordCount += take.length;
				return take.join(" ") + (take.length && wordCount === wordLimit ? "..." : "");
			}

			if (node.nodeType === Node.ELEMENT_NODE) {
				const tag = node.nodeName.toLowerCase();
				const openTag = `<${tag}${getAttributes(node as Element)}>`;
				const children = Array.from(node.childNodes).map(walkNodes).join("");
				const closeTag = `</${tag}>`;
				return openTag + children + closeTag;
			}

			return "";
		}

		function getAttributes(el: Element): string {
			return Array.from(el.attributes)
				.map((attr) => ` ${attr.name}="${attr.value}"`)
				.join("");
		}

		doc.body.childNodes.forEach((node) => {
			if (wordCount < wordLimit) {
				output += walkNodes(node);
			}
		});

		return output;
	}
	export() {
		this.service.export().subscribe((response) => {
			window.open(response.link, "_blank");
		});
	}
}
