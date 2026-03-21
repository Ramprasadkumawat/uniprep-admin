import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Accordion, AccordionModule } from "primeng/accordion";
import { InformationService } from "./information.service";
import { MessageService, ConfirmationService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import {TabsModule} from 'primeng/tabs';
import { TableModule } from "primeng/table";
import {SelectModule} from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { FileUploadModule } from "primeng/fileupload";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
@Component({
    selector: "uni-infokit",
    imports: [
        CommonModule,
        InputTextModule,
        TabsModule,
        TableModule,
        AccordionModule,
        SelectModule,
        ReactiveFormsModule,
        FileUploadModule,
        MultiSelectModule,
        ConfirmPopupModule,
    ],
    templateUrl: "./infokit.component.html",
    styleUrls: ["./infokit.component.scss"]
})
export class InfoKitComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("accordion", { static: false }) accordion!: Accordion;
  constructor(
    private fb: FormBuilder,
    private service: InformationService,
    private toastr: MessageService,
    private confirmService: ConfirmationService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      filename: [""],
      files: [""],
      status: new FormControl(),
    });
  }
  folderdata: any = "0";
  parentfolderlists = [];
  form: FormGroup;
  btntxt = "Create Folder";
  headertext = "Add Folder";
  submitted = false;
  activeIndex = 0;
  statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "In-Active" },
  ];
  ngOnInit(): void {
    this.getFolderData(this.folderdata);
  }
  assets = [];

  get f() {
    return this.form.controls;
  }
  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.btntxt == "Create Folder") {
        var data = {
          folder_name: this.form.value.name,
          parent_id: this.folderdata,
          status: this.form.value.status,
        };
        this.service.CreateParentFolder(data).subscribe((res) => {
          if (res) {
            this.toastr.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.form.reset();
            this.submitted = false;
            this.iconimage = "";
            this.getFolderData(this.folderdata);
          }
        });
      } else {
        var updatedata = {
          folder_name: this.form.value.name,
          id: this.folderdata,
          status: this.form.value.status,
        };
        this.service.UpdateFolder(updatedata).subscribe((res) => {
          if (res) {
            this.toastr.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.form.reset();
            this.submitted = false;
            this.btntxt = "Create Folder";
            this.getFolderData("0");
          }
        });
      }
    }
  }
  indextchange(eve: number) {
    this.activeIndex = eve;
  }
  selectedFile: File | undefined;
  iconimage: any;

  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.iconimage = file;
      this.form.patchValue({
        filename: this.iconimage.name,
      });
    }
  }
  files: any;
  onfilesChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.files = file;
      event.preventDefault();
      event.stopPropagation();
      var data = {
        folder_id: this.folderdata,
        file_name: this.files,
      };
      this.service.CreateFile(data).subscribe((res) => {
        if (res) {
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getFolderData(this.folderdata);
        }
      });
    }
  }
  getFolderData(parent_id: any) {
    this.service
      .GetFolderList({
        parent_id: parent_id,
      })
      .subscribe((res) => {
        this.parentfolderlists = res?.data;
      });
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
  }
  routedata = [];
  getchildinfo(data) {
    if (data.isFolder == "2") {
      return;
    }
    this.folderdata = data.id;
    this.routedata.push({
      id: data.id,
      name: data.name,
      data: data,
    });
    this.getFolderData(this.folderdata);
  }
  selectedStatus: any;
  deletedata(data) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure to delete the prompt? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.service
          .DeleteFile({ id: data.id, folder_or_file: data.isFolder })
          .subscribe((res) => {
            if (res) {
              this.toastr.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
              this.files = "";
              this.getFolderData(this.folderdata);
            }
          });

      },
      reject: () => {
        this.toastr.add({ severity: "error", summary: "Rejected", detail: "You rejected..!", });
      },
    });
  }

  editdata(data) {
    this.btntxt = "Update Folder";
    this.form.patchValue({
      name: data.name,
    });
    this.folderdata = data.id;
    this.selectedStatus = "1";
  }
  actionedrouteData: any = [];
  redirectTo(path: any, arrayindex: number) {
    if (path == "info") {
      this.folderdata = "0";
      this.routedata = [];
      this.getFolderData("0");
      return;
    }
    this.folderdata = path.id;
    this.actionedrouteData = [];
    this.routedata.forEach((rdata: any, index: number) => {
      if (index <= arrayindex) {
        this.actionedrouteData.push(rdata);
      }
    });
    this.routedata = this.actionedrouteData;
    this.getFolderData(path.id);
  }
  openFile(url) {
    window.open(url, "_blank");
  }
}