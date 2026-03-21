import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoliticianService } from '../../add-politician-insights/politician-insights.service';
import { MessageService } from 'primeng/api';
import { Country } from 'src/app/@Models/country.model';
import { Politician } from 'src/app/@Models/politician.model';
import { FounderstoolService } from '../founderstool.service';
import { GovernmentFund } from 'src/app/@Models/government-funding.model';

@Component({
    selector: 'uni-add-government-funding',
    templateUrl: './add-government-funding.component.html',
    styleUrls: ['./add-government-funding.component.scss'],
    standalone: false
})
export class AddGovernmentFundingComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  Addformshow: boolean = true;
  countryList: Country[] = [];
  stateList: any = [];
  fundTypeList: any = [];
  submitted: boolean = false;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  activeIndex: number = 0;
  governmentFundingList: GovernmentFund[] = [];
  fundingCount: number = 0;
  filterFundNameList: { name: string }[] = [];
  @ViewChild('formElm') formElm!: ElementRef;
  selectedFund: any;
  selectAllCheckboxes: boolean = false;
  PersonalInfo: any = [];
  favCount = 0;
  exportDataIds: number[] = [];
  constructor(private fb: FormBuilder, private toast: MessageService, private founderToolService: FounderstoolService, private toaster: MessageService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      fund_type: ['', Validators.required],
      website: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      name: [''],
      country: [''],
      state: [''],
      fund_type: ['']
    });
  }

  ngOnInit(): void {
    this.getCountryList();
    this.getStateList();
    this.getFundTypeList();
    this.GetPersonalProfileData();
    this.getGovernmentFundingList();
    this.getFundNameList();
  }

  getCountryList() {
    this.founderToolService.getFundCountries().subscribe(data => {
      this.countryList = data;
    });
  }

  getStateList() {
    this.founderToolService.getFundStateByCountry().subscribe(data => {
      this.stateList = data;
    });
  }

  getFundTypeList() {
    this.founderToolService.getFundType().subscribe(data => {
      this.fundTypeList = data;
    });
  }

  getFundNameList() {
    this.founderToolService.getFundName().subscribe(data => {
      this.filterFundNameList = data;
    });
  }

  get f() {
    return this.form.controls;
  }

  submitFilterForm() {
    const value = this.filterForm.value;
    var data = {
      perpage: 10,
      page: 1,
      name: value?.name || null,
      country: value?.country || null,
      region: value?.state || null,
      type: value?.fund_type || null
    };
    this.founderToolService.getFundList(data).subscribe(response => {
      this.governmentFundingList = response.governmentfundings;
      this.fundingCount = response.count;
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    var data = {
      name: value.name,
      country: value.country,
      region: value.state,
      website: value.website,
      type: value.fund_type
    }
    this.founderToolService.addGovernmentFunding(data).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getGovernmentFundingList();
    });
  }

  getGovernmentFundingList() {
    let req = {
      page: this.page,
      perpage: this.rows,
    }
    this.founderToolService.getFundList(req).subscribe((response) => {
      this.governmentFundingList = response.governmentfundings;
      this.fundingCount = response?.count;
    });
  }

  exportFundingList() {
    this.founderToolService.exportSelectedData(this.filterForm.value).subscribe((res: any) => {
      this.founderToolService.downloadFile(res.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = "export.csv";
        document.body.appendChild(a);

        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    })
  }

  resetForm() {
    this.form.reset();
  }


  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getGovernmentFundingList();
  }

  onCheckboxChange(event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedFund = isChecked ? this.selectedFund + 1 : this.selectedFund - 1;
    if (isChecked == false) {
      if (this.selectedFund) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.governmentFundingList.length == this.selectedFund) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  bookmarkQuestion(FundId: any, isFav: any) {
    console.log(isFav);
    isFav = isFav != '1' ? true : false;
    this.founderToolService.addFavFundData(FundId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let fundListData = this.governmentFundingList.find(item => item.id == FundId);
      isFav == true ? fundListData.favourite = 1 : fundListData.favourite = null;
      this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }

  resetButton() {
    this.filterForm.reset();
    this.submitFilterForm();
    this.ngOnInit();
  }

  GetPersonalProfileData() {
    this.founderToolService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }

  exportData() {
    this.exportDataIds = [];
    this.governmentFundingList.forEach(item => {
      if (item.isChecked == 1) {
        this.exportDataIds.push(item.id);
      }
    })
    if (this.exportDataIds.length == 0) {
      this.toast.add({ severity: "error", summary: "error", detail: "Select Some data for export!.", });
      return;
    }
    let data = {
      module_id: 3,
      export_id: this.exportDataIds
    };
    this.founderToolService.exportSelectedData(data).subscribe((response) => {
      window.open(response.link, '_blank');
      this.selectAllCheckboxes = false;
      // this.selectedCheckboxCount = 0;
      this.selectedFund = 0;
    })
  }
}
