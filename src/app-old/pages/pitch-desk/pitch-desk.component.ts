import { Component, OnInit, ViewChild  } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { PitchDeskService } from './pitch-desk.service';
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
    selector: 'uni-pitch-desk',
    templateUrl: './pitch-desk.component.html',
    styleUrls: ['./pitch-desk.component.scss'],
    providers: [ConfirmationService],
    standalone: false
})
export class PitchDeskComponent implements OnInit {
  @ViewChild('fileImageUpload') fileImageUpload!: FileUpload;
  @ViewChild('fileDocUpload') fileDocUpload!: FileUpload;
  form: FormGroup;
  filterForm: FormGroup;
  filterYesOrNo: any[]= [
    {id: "empty", value: "Empty"},
    {id: "not_empty", value: "Not Empty"}
  ];
  btntxt = 'Add Pitch Deck';
  title ="Add Pitch Deck Info";
  activeIndex:number = -1;
  submitted:boolean = false;
  countrySelectBox: any[];
  fundingTypeSelectBox: any[];
  sectorSelectBox:any[];
  headQuartersSelectBox: any[];
  selectedFile: File;
  pageSize: number = 50;
  page: number = 1;
  pitchDeckList: any[];
  PitchDeckCounts: number = 0;
  fileUploadModal: boolean = false;
  selectAllCheckboxes:boolean = false;
  selectedCheckboxIds:any[];
  importFile: any;
  PatchImageName: string = "";
  patchDocumentName: string = "";
  documentPath: string = "";

  constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private toastr: MessageService,
      private pitchdeckservice: PitchDeskService,
      private confirmationService: ConfirmationService,
  ) { 

    this.form = fb.group({
      pitch_deck_name: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      country: ['', [Validators.required]],
      head_quarters: ['', [Validators.required]],
      funding_type: ['', [Validators.required]],
      founding_year: ['', [Validators.required]],
      funding_amount: ['', [Validators.required]],
      pitch_deck_image: [''],
      pitch_deck_document: ['', [Validators.required]],
      pitch_deck_image_name:[''],
      pitch_deck_document_name:[''],
      id:new FormControl()
    });

    this.filterForm = fb.group({
      pitch_deck_name: [""],
      sector:[""],
      country: [""],
      head_quarters: [""],
      funding_type: [""]
    });
  }

  ngOnInit(): void {
    this.loadSelectBoxValues();
    this.LoadPitchDeck();
  }

  LoadPitchDeck(){
    
    let data = {
      pitchdeck_name: this.filterForm.value.pitch_deck_name ? this.filterForm.value.pitch_deck_name : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      page: this.page,
      perpage: this.pageSize,
    }

    this.pitchdeckservice.getPitchDeckData(data).subscribe((response) => {
      this.pitchDeckList = response.data;
      this.PitchDeckCounts = response.total_count;
    });
    this.selectAllCheckboxes = false;
  }

  DownloadPitch(documentName){
    window.open(documentName, '_blank');
  }

  get f() {
    return this.form.controls;
  }

  loadSelectBoxValues(){
    this.pitchdeckservice.getSelectBoxValues().subscribe((responce) =>{
      this.countrySelectBox = responce.country;
      this.sectorSelectBox = responce.sectors;
      this.fundingTypeSelectBox = responce.funding_type;
    });
  }

  submitForm(){
    if(this.form.invalid){
      this.submitted=true;
      return;
    }
    if(this.btntxt=="Add Pitch Deck"){
      this.pitchdeckservice.storePitchDeckData(this.form.value).subscribe((responce)=>{
        this.toastr.add({ severity:responce.status , summary: responce.status, detail: responce.message });
        
      });
    }else{
      this.pitchdeckservice.updatePitchDeck(this.form.value).subscribe((responce)=>{
        this.toastr.add({ severity:responce.status , summary: responce.status, detail: responce.message });
      });
    }
    this.LoadPitchDeck();
    this.clearDocument();
    this.clearImage();
    this.form.reset();
    this.submitted=false;
    this.activeIndex=-1;
  }

  onImageSelect(event: any) {
    this.form.get('pitch_deck_image_name').setValue(event.currentFiles[0].name);
    this.selectedFile = event.currentFiles[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(',')[1]; // Extract base64 data
        this.form.get('pitch_deck_image').setValue(base64Data);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onDocumentSelect(event: any) {
    this.form.get('pitch_deck_document_name').setValue(event.currentFiles[0].name);
    this.selectedFile = event.currentFiles[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(',')[1]; // Extract base64 data
        this.form.get('pitch_deck_document').setValue(base64Data);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  reset(){
    this.submitted = false;
    this.form.reset();
    this.activeIndex=0;
    this.btntxt="Add Pitch Deck";
    this.title="Add Pitch Deck Info"
  }

  clearImage() {
    if (this.fileImageUpload) {
      this.fileImageUpload.clear();
      this.form.get('pitch_deck_image')?.setValue('');
      this.form.get('image_name')?.setValue('');
      this.PatchImageName = "";
    }
  }

  clearDocument() {
    if (this.fileDocUpload) {
      this.fileDocUpload.clear();
      this.form.get('pitch_deck_document')?.setValue('');
      this.form.get('document_name')?.setValue('');
      this.patchDocumentName = "";
    }
  }

  onChangeCountry(selectedCountry: number){
    this.pitchdeckservice.getHeadQuartersOptions(selectedCountry).subscribe((response) => {
      this.headQuartersSelectBox = response;
    });
  }

  submitFilterForm(){
    const formData = this.filterForm.value;
    if (!formData.pitch_deck_name  && !formData.sector  && !formData.country && !formData.head_quarters && !formData.funding_type) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }

    let data = {
      pitchdeck_name: this.filterForm.value.pitch_deck_name ? this.filterForm.value.pitch_deck_name : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      page: this.page,
      perpage: this.pageSize,
    }

    this.pitchdeckservice.getPitchDeckData(data).subscribe((response) => {
      this.pitchDeckList = response.data;
      this.PitchDeckCounts = response.total_count;
    });

  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    // let data = {
    //   page: this.page,
    //   perPage: this.pageSize
    // }
    this.LoadPitchDeck();
  }


  editPitchDeck(data: any){
    this.activeIndex=0;
    this.onChangeCountry(data.country_id);
    this.btntxt="Update Pitch Deck";
    this.title="Update Pitch Deck Info";
    this.PatchImageName = data.patch_image_name;
    this.patchDocumentName = data.patch_document_name;
    this.form.patchValue({
      pitch_deck_name: data.pitchdeck_name,
      sector: data.sector_id,
      country: data.country_id,
      head_quarters: Number(data.head_quarters_id),
      funding_type: data.funding_type_id,
      founding_year: data.founding_year,
      funding_amount: data.funding_amount,
      pitch_deck_image: data.patch_image_name,
      pitch_deck_document: data.patch_document_name,
      id: data.id
    });
  }

  filterReset(){
    this.filterForm.reset();
    this.LoadPitchDeck();
  }

  deletePitch(deleteId){
    this.pitchdeckservice.deletePitchs(deleteId).subscribe((responce) =>{
      this.toastr.add({severity: responce.status,summary: responce.status,detail: responce.message});
      this.LoadPitchDeck();
    })
  }

  deleteSelected() : void{
    this.selectedCheckboxIds = [];
    this.pitchDeckList.forEach(item=> {
      if(item.isChecked == 1){
        this.selectedCheckboxIds.push(item.id);
      }
    });
    if(this.selectedCheckboxIds.length != 0){
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Are you sure that you want to delete?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.pitchdeckservice.deletePitchs(this.selectedCheckboxIds).subscribe((responce) =>{
            this.toastr.add({severity: responce.status,summary: responce.status,detail: responce.message});
            this.LoadPitchDeck();
          })
        },
        reject: () => {
          this.toastr.add({severity: "error",summary: "Rejected",detail: "You have rejected"});
        },
      });
    }else{
      this.toastr.add({severity: "error",summary: "Rejected",detail: "Please select Atleast one row."});
    }
  }

  selectAllCheckbox(){
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.pitchDeckList.forEach(item =>{
        item.isChecked = 1;
      });
    }else{
      this.pitchDeckList.forEach(item =>{
        item.isChecked = 0;
      })
    }
  }

  onFileChange(event:any){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.importFile = inputElement.files[0];
    } else {
      this.importFile = null;
    }
    
  }

  uploadFile(){
    if (this.importFile) {
      this.pitchdeckservice.importPitchDeck(this.importFile).subscribe((response) => {
          if(response.link){
            window.open(response.link, '_blank');
          }
          this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
          this.fileUploadModal = false;
          this.importFile = null;
          this.LoadPitchDeck();
      });
    } else {
      this.toastr.add({severity: "error",summary: "Error",detail: "Please choose file!",});
    }
  }

  exportTable(){

    let data = {
      pitchdeck_name: this.filterForm.value.pitch_deck_name ? this.filterForm.value.pitch_deck_name : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      page: this.page,
      perpage: this.pageSize,
    }
    
    this.pitchdeckservice.exportPitchs(data).subscribe((response) =>{
      window.open(response.link, '_blank');
    })

    
  }
  
}
