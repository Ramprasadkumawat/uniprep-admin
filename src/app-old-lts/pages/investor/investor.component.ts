import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import {InvestorService} from "./investor.service";
interface Status {
  name: string;
  id: number;
}

@Component({
    selector: 'uni-investor',
    templateUrl: './investor.component.html',
    styleUrls: ['./investor.component.scss'],
    providers: [ConfirmationService],
    standalone: false
})
export class InvestorComponent implements OnInit {
  fileUploadModal: boolean = false;
  form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  pageSize = 100;
  activeIndex = -1;
  title ="Add Investor Info"
  totalInvestorsCount: any;
  investorData: any []= []
  headQuartersList: any;
  investorType: any;
  countryList: any;
  selectedFile: any;
  filterYesOrNo: any[]= [
    {id: "empty", value: "Empty"},
    {id: "not_empty", value: "Not Empty"}
  ];
  firstPageYesOrNo: any[]= [
    {id: "yes", value: "Yes"},
    {id: "no", value: "No"}
  ];
  constructor(
      private fb: FormBuilder,
      private toastr: MessageService,
      private confirmationService: ConfirmationService,
      private http: HttpClient,
      private investorService: InvestorService,
  ) {
    this.form = fb.group({
      org_name: ['', [Validators.required]],
      email:['', [Validators.email]],
      country:['', [Validators.required]],
      head_quarters:['', [Validators.required]],
      investor_type:['', [Validators.required]],
      website: ['', [Validators.pattern(/^https?:\/\/\S+$/)]],
      linked_in: ['', [Validators.pattern(/^https?:\/\/\S+$/)]],
      id:new FormControl()
    });
    this.filterForm = fb.group({
      org_name: [""],
      email:[""],
      country: [""],
      head_quarters: [""],
      investor_type: [""],
      website:[""],
      linked_in: [""],
      first_page: [""],
    });
  }
  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.org_name  && !formData.email  && !formData.country && !formData.head_quarters && !formData.investor_type && !formData.website && !formData.linked_in && !formData.first_page) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let data = {
      org_name: this.filterForm.value.org_name ? this.filterForm.value.org_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      investor_type: this.filterForm.value.investor_type ? this.filterForm.value.investor_type : '',
      email: this.filterForm.value.email ? this.filterForm.value.email : '',
      website: this.filterForm.value.website ? this.filterForm.value.website : '',
      linked_in: this.filterForm.value.linked_in ? this.filterForm.value.linked_in : '',
      first_page: this.filterForm.value.first_page ? this.filterForm.value.first_page : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.investorService.getInvestorList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalInvestorsCount = response.count;
    });
  }
  get f() {
    return this.form.controls;
  }
  reset() {
    this.submitted = false;
    this.form.reset();
    this.activeIndex=0;
    this.btntxt="Add Investor";
    this.title="Add Investor Info"
  }
  resetFilter(){
    this.filterForm.reset()
    let formdata = this.filterForm.value;
    this.data.name = formdata?.name;
    this.data.status = formdata?.status;
    this.loadInvestorData();
  }
  statuses: Status[] | any;
  ngOnInit(): void {
    this.loadMultiSelectData()
    this.loadInvestorData();
  }


  loadMultiSelectData(){
    this.investorService.getMultiSelectData().subscribe((response) => {
      this.investorType = response.investor_type;
      this.countryList = response.countries_list;
    });
  }

  loadInvestorData(){
    let data = {
      org_name: this.filterForm.value.org_name ? this.filterForm.value.org_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      investor_type: this.filterForm.value.investor_type ? this.filterForm.value.investor_type : '',
      first_page: this.filterForm.value.first_page ? this.filterForm.value.first_page : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.investorService.getInvestorList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalInvestorsCount = response.count;
    });
  }

  editInvestor(data:any){
    
    this.activeIndex=0;
    this.onChangeCountry(data.country_id);
    this.btntxt="Update Investor";
    this.title="Update Investor Info";
    this.form.patchValue({
      org_name: data.org_name,
      email: data.email,
      country: data.country_id,
      head_quarters: Number(data.head_quarters_id),
      investor_type: data.investor_type_id,
      website: data.website,
      linked_in: data.linked_in,
      id: data.id
    })
  }
  btntxt="Add Investor";
  faqcategorielists:any[]=[];


  datacount:number=0;
  data:any={page:1,perpage:this.pageSize}
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize
    }
    this.loadInvestorData();
  }
  submitForm() {  
    if(this.form.invalid){
      this.submitted=true;
      return;
    }

    if(this.btntxt=="Add Investor"){
      this.submitted=true;
      // if(this.form.value.org_type != ""){
      //   this.form.value.org_type = this.form.value.org_type.map(function(value) {
      //     return String(value);
      //   });
      // }
      
      // if(this.form.value.industry_interested != ""){
      //   this.form.value.industry_interested = this.form.value.industry_interested.map(function(value) {
      //     return String(value);
      //   });
      // }
      console.log(456);
     // if(this.form.value.investor_type != ""){

      //  this.form.value.investor_type = this.form.value.investor_type.map(function(value) {
     //     return String(value);
     //   });
     // }
      
      this.investorService.addInvestor(this.form.value).subscribe((response) => {
        this.toastr.add({severity: response.status,summary: response.status, detail: response.message});
        if(response.status == "success"){
          this.submitted=false;
          this.form.reset();
          this.loadInvestorData();
          this.activeIndex=-1;
        }else{
          return;
        }
      })
    }else{
      this.investorService.updateInvestor(this.form.value).subscribe((response) => {
        this.btntxt="Add Investor";
        this.title="Add Investor"
        this.toastr.add({severity: response.status,summary: response.status, detail: response.message});
        if(response.status == "success"){
          this.submitted=false;
          this.form.reset();
          this.loadInvestorData();
          this.activeIndex=-1;
        }else{
          return;
        }
      })
    }

  }

  // delete(id: number) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       var data={
  //         id:id
  //       }

  //       this.service.DeleteFAQCategories(data).subscribe(() => {
  //         this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
  //         this.ngOnInit()
  //       });
  //       this.getfaqcategories(this.data);
  //     }
  //   });
  // }

  // export
  exportTable() {
    
      let data: any = {};
      const formData = this.filterForm.value;
      if (formData.org_name) {
        data.org_name = formData.org_name;
      }
      if (formData.email) {
        data.email = formData.email;
      }
      if (formData.country) {
        data.country = formData.country;
      }
      if (formData.head_quarters) {
        data.head_quarters = formData.head_quarters;
      }
      if (formData.investor_type) {
        data.investor_type = formData.investor_type;
      }
      if (formData.website) {
        data.website = formData.website;
      }
      if (formData.linked_in) {
        data.linked_in = formData.linked_in;
      }
      if (formData.first_page) {
        data.first_page = formData.first_page;
      }
     
    this.investorService.export(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadFile(){
    if (this.selectedFile) {
      this.investorService.import(this.selectedFile).subscribe((response) => {
          if(response.link){
            window.open(response.link, '_blank');
          }
          this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
          this.fileUploadModal = false;
          this.selectedFile = null;
          this.loadInvestorData();
      });
    } else {
      this.toastr.add({severity: "error",summary: "Error",detail: "Please choose file!",});
    }
  }

  onChangeCountry(selectedCountry: number){
    this.investorService.getHeadQuartersOptions(selectedCountry).subscribe((response) => {
      this.headQuartersList = response;
    });
  }

  deleteInvestor(investorId: number){
    this.investorService.deleteInvestors(investorId).subscribe((response) => {
      this.toastr.add({severity: response.status,summary: response.status, detail: response.message});
      this.loadInvestorData();
    });
  }
}
