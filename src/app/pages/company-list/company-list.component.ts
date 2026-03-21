import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import { HttpClient } from "@angular/common/http";
import {CompanyListService} from "./company-list.service";
interface Status {
  name: string;
  id: number;
}

@Component({
    selector: 'uni-company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss'],
    providers: [ConfirmationService],
    standalone: false
})
export class CompanyListComponent implements OnInit {

  fileUploadModal: boolean = false;
  form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  pageSize = 100;
  activeIndex = -1;
  title ="Add Company Info"
  totalCount: any;
  investorData: any []= []
  company_industry: any;
  headQuartersList: any;
  countryList: any;
  selectedFile: any;
  firstPageYesOrNo: any[]= [
    {id: "yes", value: "Yes"},
    {id: "no", value: "No"}
  ];
  constructor(
      private fb: FormBuilder,
      private toastr: MessageService,
      private confirmationService: ConfirmationService,
      private http: HttpClient,
      private companyListService: CompanyListService,
  ) {
    this.form = fb.group({
      company_name: ['', [Validators.required]],
      country:['', [Validators.required]],
      head_quarters:['', [Validators.required]],
      estd_date:[''],
      industry_interested:['', [Validators.required]],
      website: ['', [Validators.pattern(/^https?:\/\/\S+$/)]],
      linked_in: ['', [Validators.pattern(/^https?:\/\/\S+$/)]],
      id:new FormControl()
    });
    this.filterForm = fb.group({
      company_name: [""],
      country: [""],
      head_quarters: [""],
      fromdate: [""],
      todate: [""],
      industry_interested: [""],
      first_page: [""],
    });
  }
  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let data = {
      company_name: this.filterForm.value.company_name ? this.filterForm.value.company_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      fromdate: this.filterForm.value.fromdate ? this.filterForm.value.fromdate : '',
      todate: this.filterForm.value.todate ? this.filterForm.value.todate : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      first_page: this.filterForm.value.first_page ? this.filterForm.value.first_page : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.companyListService.getCompanyList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalCount = response.count;
    });
    // let formDataNew = this.filterForm.value;
    // this.data.name = formDataNew?.name;
    // this.data.status = formDataNew?.status;
    // this.getfaqcategories(this.data);
  }
  get f() {
    return this.form.controls;
  }
  reset() {
    this. submitted = false;
    this.form.reset();
    this.activeIndex=0;
    this.btntxt="Add Company";
    this.title="Add Company Info"
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
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.countryList = response.countries_list;
      this.company_industry = response.company_industry;
    });
  }

  // resetFilter(){
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }


  loadInvestorData(){
    let data = {
      company_name: this.filterForm.value.company_name ? this.filterForm.value.company_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      fromdate: this.filterForm.value.fromdate ? this.filterForm.value.fromdate : '',
      todate: this.filterForm.value.todate ? this.filterForm.value.todate : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      first_page: this.filterForm.value.first_page ? this.filterForm.value.first_page : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.companyListService.getCompanyList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalCount = response.count;
    });
  }
  editInvestor(data:any){
    this.activeIndex=0;
    this.btntxt="Update Company";
    this.title="Update Company Info";
    this.onChangeCountry(data.country);
    this.form.patchValue({
      company_name: data.company_name,
      country: data.country,
      head_quarters: Number(data.head_quarters),
      estd_date: data.estd_date,
      industry_interested: JSON.parse(data.industry_interested_id) || [],
      website: data.website,
      linked_in: data.linked_in,
      id: data.id
    })
  }
  btntxt="Add Company";
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
    if(this.btntxt=="Add Company"){
      
      this.form.value.industry_interested = this.form.value.industry_interested.map(function(value) {
        return String(value);
      });
      this.companyListService.addCompanyInfo(this.form.value).subscribe((response) => {
        this.toastr.add({severity: response.status, summary: response.status, detail: response.message});
        this.submitted=false;
        this.form.reset();
        this.loadInvestorData();
        this.activeIndex=-1;
      })}
    else {
      this.companyListService.updateCompanyInfo(this.form.value).subscribe((response) => {
        this.btntxt="Add Company";
        this.title="Add Company"
        this.toastr.add({severity: response.status, summary: response.status, detail: response.message});
        this.submitted=false;
        this.form.reset();
        this.loadInvestorData();
        this.activeIndex=-1;
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
    
      if (formData.company_name) {
        data.company_name = formData.company_name;
      }
      if (formData.country) {
        data.country = formData.country;
      }
      if (formData.head_quarters) {
        data.head_quarters = formData.head_quarters;
      }
      if (formData.fromdate) {
        data.fromdate = formData.fromdate;
      }
      if (formData.todate) {
        data.todate = formData.todate;
      }
      if (formData.industry_interested) {
        data.industry_interested = formData.industry_interested;
      }
      if (formData.first_page) {
        data.first_page = formData.first_page;
      }

    this.companyListService.export(data).subscribe((response) => {
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
      this.companyListService.import(this.selectedFile).subscribe((response) => {
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
    this.companyListService.getHeadQuartersOptions(selectedCountry).subscribe((response) => {
      this.headQuartersList = response;
    });
  }

  deleteCompany(investorId: number){
    this.companyListService.deleteCompany(investorId).subscribe((response) => {
      this.toastr.add({severity: response.status,summary: response.status, detail: response.message});
      this.loadInvestorData();
    });
  }
}
