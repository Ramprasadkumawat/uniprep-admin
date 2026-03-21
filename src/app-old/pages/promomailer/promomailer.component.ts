import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import screenfull from "screenfull";
import { PromomailerService } from './promomailer.service';
import { PageFacadeService } from '../page-facade.service';
import { UserFacadeService } from '../users/user-facade.service';
import { UserType } from 'src/app/@Models/user.model';
import { filter, Observable } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';

//import { ToastrService } from 'ngx-toastr';
//import {QuillModule} from 'ngx-quill'
interface sourcetype {
  id: number
  name: string
}
interface country {
  id: number
  country: string
  flag: string
  status: number
  created_at: string
  updated_at: string
}

interface location {
  id: number
  state: string
  district: string
  status: number
  created_at: string
  updated_at: string
}
interface status {
  id: number
  status_name: string
}
interface year {
  label: string,
  year: number
}



@Component({
    selector: 'uni-promomailer',
    templateUrl: './promomailer.component.html',
    styleUrls: ['./promomailer.component.scss'],
    imports: [
        CommonModule,
        InputTextModule,
        TabsModule,
        TableModule,
        AccordionModule,
        SelectModule,
        TextareaModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        FormsModule,
        EditorModule,
        MultiSelectModule,
        DatePickerModule,
        BadgeModule,
        FileUploadModule,
        DialogModule,
        TooltipModule,
        PopoverModule,
        ChipModule,
        // ToastrService
        //QuillModule,
    ],
    styles: [
        `
      :host ::ng-deep .p-treeselect {
        width: 100%;
        display: inline-flex;
        height: 37px;
      }
      :host ::ng-deep .p-multiselect {
        width: 100%;
        display: inline-flex;
        height: 37px;
      }
      :host ::ng-deep .p-dropdown {
        width: 100%;
        display: inline-flex;
        height: 37px;
      }
    `,
    ]
})
export class PromomailerComponent implements OnInit {
  // textMessage=""
  sendmessageLoading: boolean = false;
  modules = {};
  visibility = false;
  fullscreen = "";
  @ViewChild("fullscreeneditor") editorelement: ElementRef;
  activeButton: number = 1;
  myLeadFormVisible: boolean = false;
  partnersFormVisible: boolean = false;
  customFormVisible: boolean = false;
  public myLeadFilterForm: any = FormGroup;
  sourcetypes: sourcetype[] = []
  sourcelist: any
  programLevels: any = [];
  regions: any[] = [];
  locations: location[] = [];
  countries: country[] = [];
  statuses: status[] = [];
  years: year[];
  leadList: any[] = [{ id: null, name: 'Select' }, { id: 1, name: 'Direct Student User' }, { id: 2, name: 'College Student User' }];
  isMyLeadDialog: boolean = false;
  public addpeopleLeadForm: any = FormGroup
  selectedLeads: any[] = [];
  leadpeopleList: any[] = [];
  tempLeadPeopleList: any[] = [];
  valueMyLeadFilter: string | undefined;
  selectedLeadEmail: any[] = [];
  public partnersFilterForm: any = FormGroup;
  userTypes: any[] = [];
  userTypes$!: Observable<UserType[]>;
  sourceName: any = [];
  partnerStatus: any[] = [{ id: null, name: 'Select' }, { id: 1, name: 'Active' }, { id: 2, name: 'Inactive' }];
  partnerpeopleList: any[] = [];
  tempPartnerPeopleList: any[] = [];
  isPartnerDialog: boolean = false;
  selectedPartners: any[] = [];
  valuePartnerFilter: string | undefined;
  public customUsersForm: any = FormGroup;
  isCustomDialog: boolean = false;
  selectedFile: any;
  accumulatedEmails: { name: string, email: string, lastSendDateTime: string }[] = [];
  customUserpeopleCount: any;
  customUserpeopleList: any[] = [];
  value: string = '';
  nameandeail: any = '';
  valueCustomUserFilter: string | undefined;
  public promomailConfiguration: any = FormGroup;
  selectedmailertype: any[] = [];
  selectedData: { label: string; value: string }[] = [
    { label: 'MyLeads', value: '1' },
    { label: 'Partners', value: '2' },
    { label: 'Custom Users', value: '3' }
  ];
  tempEmailIds: any;
  submitted: boolean = false;
  campaignstatus = 1;
  campaignvisibility: boolean = false;
  recipientTypes: any[] = [];
  allSelectedEmails: any[] = [];
  selectedCustomEmail: any[] = [];
  selectedCustomUser: any[] = [];
  selectedPartnerEmail: any[] = [];
  selectedPartner: any[] = [];
  displayedEmails = [];
  sendEmailsLists: any[] = [];
  tabindexes = 0;
  htmlContent = "";
  selectedEmailsList: any[] = [];
  selectedEmails: any[] = [];
  draftsdata: any[] = [];
  filterDraftsDialogVisible: boolean = false;
  public filterDraftsForm: any = FormGroup;
  dropdownOptions: { id: number, option: string }[] = [];
  public filterHistoryForm: any = FormGroup;
  filterHistoryVisible: boolean = false;
  messageHistory: any;
  totalClicked: any;
  totalOpened: any;
  totalSentMails: any
  totalUnsubscribed: any;
  public filterUnsubscribersForm: any = FormGroup;


  constructor(public service: PromomailerService, private formbuilder: FormBuilder, private cd: ChangeDetectorRef,
    private pageService: PageFacadeService, private userFacade: UserFacadeService, private toastr: MessageService, private authservice: AuthService) {
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
          // ["fullscreen"],
        ],
        handlers: {
          emoji: function () { },
          attachmentHandler: () => {
            this.visibility = !this.visibility;
          },
          fullscreen: () => {
            if (screenfull.isEnabled) {
              this.fullscreen = this.fullscreen ? "" : "fullscreen";
              screenfull.toggle(this.editorelement.nativeElement);
            }
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.myLeadFilterForm = this.formbuilder.group({
      sourcetype: new FormControl(),
      source_name: new FormControl(),
      programlevel: new FormControl(),
      country: new FormControl(),
      region: new FormControl(),
      location: new FormControl(),
      passingyear: new FormControl(null),
      leadstatus: new FormControl(),
      lead_type: new FormControl(),


    })
    this.partnersFilterForm = this.formbuilder.group({
      country: new FormControl(),
      region: new FormControl(),
      location: new FormControl(),
      usertype: new FormControl(),
      source_name: new FormControl(),
      partner_status: new FormControl()
    })
    this.customUsersForm = this.formbuilder.group({
      nameemail: new FormControl()
    })
    this.promomailConfiguration = this.formbuilder.group({
      Content: new FormControl("", [Validators.required]),
      type: new FormControl(),
      Emailids: new FormControl([]),
      Subject: new FormControl("", [Validators.required]),
      scheduled_date: new FormControl(),
      scheduled_time: new FormControl,
      campaigntype: new FormControl(),
    });
    this.filterDraftsForm = this.formbuilder.group({
      fromdate: new FormControl,
      todate: new FormControl,
      senttime: new FormControl,
      sentby: new FormControl,
      sentto: new FormControl,
      recipients: new FormControl,
    });
    this.filterHistoryForm = this.formbuilder.group({
      fromdate: new FormControl,
      todate: new FormControl,
      recipients: new FormControl,
      sentby: new FormControl,
      sentto: new FormControl,

    });
    this.filterUnsubscribersForm = this.formbuilder.group({
      name: new FormControl,
      email: new FormControl,
      roletype: new FormControl,
      usertype: new FormControl,
      unsubscribeddate: new FormControl,
      unsubscribedtime: new FormControl
    })
    this.dropdownOptions = Object.keys(this.roleTypeMapping).map(key => ({
      id: this.roleTypeMapping[key],
      option: key
    }));
    this.getProgramLevelList();
    this.getUserTypeList();
    this.getUnsubscribersList();

    this.service.GetSourcetypeList().subscribe((response) => {
      this.sourcetypes = [...response]
    })
    this.service.GetCountryList().subscribe((response) => {
      this.countries = [...response];
    })
    this.service.GetStatusList().subscribe((response) => {
      this.statuses = response
    })
    this.years = [
      { label: "Select", year: null },
      { label: "2023", year: 2023 },
      { label: "2024", year: 2024 },
      { label: "2025", year: 2025 },
      { label: "2026", year: 2026 },
      { label: "2027", year: 2027 },
    ];
    this.GetDraftsList();
    this.getMailHistory();
    this.getUser();
  }
  get f() {
    return this.promomailConfiguration.controls;
  }
  button1Style = {

    background: "white",
    color: " var(--p-primary-500) ",
    border: "1px solid  var(--p-primary-500)",
    'font-size': "17px",
    height: "55px"
  };
  button2Style = {
    background: "white",
    color: " var(--p-primary-500) ",
    border: "1px solid var(--p-primary-500)",
    'font-size': "17px",
    height: "55px"
  };
  button3Style = {
    background: "white",
    color: " var(--p-primary-500) ",
    border: "1px solid var(--p-primary-500)",
    'font-size': "17px",
    height: "55px"
  };

  setActiveButton(buttonNumber: number): void {

    this.button1Style = {
      background: "white",
      color: "var(--p-primary-500) ",
      border: "1px solid var(--p-primary-500)",
      'font-size': "17px",
      height: "55px"
    };
    this.button2Style = {
      background: "white",
      color: " var(--p-primary-500) ",
      border: "1px solid var(--p-primary-500)",
      'font-size': "17px",
      height: "55px"
    };
    this.button3Style = {
      background: "white",
      color: " var(--p-primary-500) ",
      border: "1px solid var(--p-primary-500)",
      'font-size': "17px",
      height: "55px"
    };
    if (buttonNumber === 1) {
      this.activeButton = 1;
      this.myLeadFormVisible = true;
      this.partnersFormVisible = false;
      this.customFormVisible = false;
      this.button1Style = {
        background: " var(--p-primary-500) ",
        color: "white",
        border: "1px solid  var(--p-primary-500)",
        'font-size': "17px",
        height: "55px"
      };


    } else if (buttonNumber === 2) {
      this.activeButton = 2;
      this.partnersFormVisible = true;
      //  this.partnersFilterForm=true;
      this.myLeadFormVisible = false;
      this.customFormVisible = false;
      this.button2Style = {
        background: " var(--p-primary-500) ",
        color: "white",
        border: "1px solid var(--p-primary-500)",
        'font-size': "17px",
        height: "55px"
      };

    }
    else {
      this.activeButton = 3;
      this.partnersFormVisible = false;
      this.myLeadFormVisible = false;
      this.button3Style = {
        background: " var(--p-primary-500) ",
        color: "white",
        border: "1px solid var(--p-primary-500)",
        'font-size': "17px",
        height: "55px"
      };
    }
  }

  // Lead Filter
  getSource(event: any) {
    let sourcetyp_id = {
      sourcetype: this.myLeadFilterForm.value.sourcetype,
    }

    if (this.myLeadFilterForm.value.sourcetype != null) {
      this.service.GetSourceBySourcetype(sourcetyp_id).subscribe((Response) => {
        this.sourcelist = [...Response]
      })
    }
  }
  getRegionList() {
    if (this.myLeadFilterForm.get('country').value == 122) {
      this.pageService.getRegion().subscribe((response) => {
        this.regions = [...response];
      });
    }
    else {
      this.regions = [{ id: 0, state: 'Others' }];
      this.myLeadFilterForm.get('region').setValue(0);
      this.locations = [{ id: 0, district: "Others", state: '', created_at: '', updated_at: '', status: null }];
      this.myLeadFilterForm.get('location').setValue(0);
    }
  }
  getProgramLevelList() {
    this.pageService.getProgaramLevels().subscribe((response) => {
      this.programLevels = [...response];
    });
  }
  getLocationList(value: string) {
    this.userFacade.getLocationByRegion(value).subscribe((response) => {
      // this.locations = [{ id: null, district: "Select" }, ...response];
      this.locations = [...response];
    });
  }
  resetFilter() {
    this.myLeadFilterForm.reset();
    this.partnersFilterForm.reset();
    this.customUsersForm.reset();
    this.ngOnInit();
  }
  changeCountry() {
    this.getRegionList();
  }
  changeRegion(event: any) {
    if (this.myLeadFilterForm.get('region').value != 0) {
      const value = event.value.toString();
      this.getLocationList(value);
    }
  }
  submitLeadData(myLeadFilterForm) {
    this.isMyLeadDialog = true;
    var leaddata = {

      country: myLeadFilterForm.controls.country.value,
      region: myLeadFilterForm.controls.region.value,
      location: myLeadFilterForm.controls.location.value,
      passingyear: myLeadFilterForm.controls.passingyear.value,
      programlevel: myLeadFilterForm.controls.programlevel.value,
      sourcetype: myLeadFilterForm.controls.sourcetype.value,
      source_name: myLeadFilterForm.controls.source_name.value,
      leadstatus: myLeadFilterForm.controls.leadstatus.value,
      lead_type: myLeadFilterForm.controls.lead_type.value,
    }
    this.service.GetLeadEmailList(leaddata).subscribe((response) => {
      this.leadpeopleList = response.emails;
      this.tempLeadPeopleList = [...response.emails];
    })
    this.myLeadFilterForm.reset();
  }
  loadRecipientTypes() {
    const storedRecipientTypes = localStorage.getItem('RecipientsTypes');
    if (storedRecipientTypes) {
      this.recipientTypes = JSON.parse(storedRecipientTypes);
      this.selectedData = this.recipientTypes.map(type => ({ label: type, value: type }));
    }
    this.promomailConfiguration.patchValue({
      type: this.selectedData.map(data => data.value)
    });
  }
  saveRecipientType(type: string) {
    const existingRecipientTypes = localStorage.getItem('RecipientsTypes');
    let recipientTypes = existingRecipientTypes ? JSON.parse(existingRecipientTypes) : [];

    if (!recipientTypes.includes(type)) {
      recipientTypes.push(type);
      localStorage.setItem('RecipientsTypes', JSON.stringify(recipientTypes));
    }
    this.loadRecipientTypes();
  }
  applyLeadFilter() {
    this.isMyLeadDialog = false;
    this.selectedLeadEmail = this.selectedLeads.map(lead => ({ email: lead.email, name: lead.name, value: 1 }));
    this.saveRecipientType('MyLeads');

    this.combineSelectedEmails();
  }
  applyCustomUserFilter() {
    this.isCustomDialog = false;
    this.saveRecipientType('Custom Users');
    this.selectedCustomEmail = this.selectedCustomUser.map(lead => ({ email: lead.email, name: lead.name, value: 3 }));
    this.combineSelectedEmails();
  }
  applyPartnerFilter() {
    this.isPartnerDialog = false;
    this.selectedPartnerEmail = this.selectedPartner.map(lead => ({ email: lead.email, name: lead.name, value: 2 }));
    console.log("  this.selectedPartnerEmail ", this.selectedPartnerEmail);

    this.combineSelectedEmails();
    this.saveRecipientType('Partners');
  }
  combineSelectedEmails() {
    this.allSelectedEmails = [
      ...(this.selectedCustomEmail ?? []),
      ...(this.selectedPartnerEmail ?? []),
      ...(this.selectedLeadEmail ?? []),
    ];
    this.cd.detectChanges();
    this.displayedEmails = [...this.allSelectedEmails];
    this.sendEmailsLists = this.displayedEmails.map(res => ({ email: res.email, name: res.name }));
    const tempEmail = this.sendEmailsLists;
    this.tempEmailIds = tempEmail.map(email => ({ label: email.email, value: email.email }));
    const emailValues = this.displayedEmails.map(emailObj => emailObj.email);
    this.promomailConfiguration.get('Emailids').setValue(emailValues);

    const formattedEmails = this.allSelectedEmails.map(user => user.email).join(', ');
    this.filterDraftsForm.get('sentto').setValue(formattedEmails);
  }
  roleTypeMapping: { [key: string]: number } = {
    "MyLeads": 1,
    "Partners": 2,
    "Custom Users": 3
  };
  generateRoleTypePayload() {
    const selectedRoleTypes = this.selectedData || [];
    const roleTypeValues = selectedRoleTypes.map((roleType: any) => this.roleTypeMapping[roleType.label]);
    return roleTypeValues;
  }
  resetSelectedList() {
    this.selectedLeads = [];
    this.selectedPartner = [];
    this.selectedCustomUser = [];
  }
  searchClick() {
    let searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
  }
  searchPeopleList(event) {

    const value = event.target.value.toLowerCase();
    if (this.isMyLeadDialog) {


      if (value) {
        this.leadpeopleList = this.tempLeadPeopleList.filter(user =>
          user.name.toLowerCase().includes(value)
        );
      } else {
        this.leadpeopleList = [...this.tempLeadPeopleList];
      }
    }
    //  else if (this.isCustomUserDialog) {

    //   if (value) {
    //     this.customUserpeopleResponse = this.tempCustomuserPeopleList.filter(user =>
    //       user.name.toLowerCase().includes(value)
    //     );
    //   } else {
    //     this.customUserpeopleResponse = [...this.tempCustomuserPeopleList];
    //   }
    // } 
    else if (this.isPartnerDialog) {


      if (value) {
        this.partnerpeopleList = this.tempPartnerPeopleList.filter(user =>
          user.name.toLowerCase().includes(value)
        );
      } else {
        this.partnerpeopleList = [...this.tempPartnerPeopleList];
      }
    }

  }
  getUserTypeList() {
    this.pageService.getSources().subscribe(response => {
      this.userTypes = [{ id: null, type: "Select" }, ...response];
    });
  }
  changeSourceType(event: any) {
    const value = event.value.toString();
    if (value == '4' || value == '9') {
      let data = {
        source: value
      }
      console.log("EVENT1 occurs", data);

      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
    if (value == '7') {
      const formData = this.partnersFilterForm.value;
      let data = {
        source: value,
        region: formData.region,
        location: formData.location
      }
      console.log("EVENT2 occurs", data);
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
  }
  getSourceName(usertype: string) {
    if (usertype == '4' || usertype == '9') {
      let data = {
        source: usertype
      }
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
  }
  submitPartnersData(partnersFilterForm) {
    this.isPartnerDialog = true;
    var partnerdata = {
      home_country_id: partnersFilterForm.controls.country.value,
      region: partnersFilterForm.controls.region.value,
      location: partnersFilterForm.controls.location.value,
      sourcetype: partnersFilterForm.controls.usertype.value,
      source: partnersFilterForm.controls.source_name.value,
      //leadstatus: partnersFilterForm.controls.partner_status.value,

    }
    this.service.GetPartnerEmailList(partnerdata).subscribe((response) => {
      this.partnerpeopleList = response.emails;
      this.tempPartnerPeopleList = [...response.emails];
    })
    this.myLeadFilterForm.reset();
  }
  //  customUsersFilterSubmit(customUsersForm){
  //   this.isCustomDialog = true;
  //  }
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      this.uploadfile();
    } else {
      this.selectedFile = null;
    }

  }
  //value: string = '';
  newcsvemail = [];
  uploadfile() {
    if (this.selectedFile) {
      const data = new FormData();
      data.append("input", this.selectedFile);
      // data.append("userid", localStorage.getItem("userid") || '');

      this.service.customUsersFilter(data).subscribe(response => {
        const newEmails = response.emails.map((user: { name: string, email: string }) => ({
          name: user.name,
          email: user.email
        }));

        this.newcsvemail.push(...newEmails);
        this.customUsersForm.patchValue({
          nameemail: this.newcsvemail.map(user => `${user.name},${user.email}`).join('\n')
        })

        this.cd.detectChanges();

        // this.toastr.success("Successfully", "Custom Users Filtered");
      }, error => {
        console.error('Error occurred:', error);
      });

      this.selectedFile = null;
    }
  }

  submitCustomUsers() {

    this.isCustomDialog = true;
    var emailString = this.customUsersForm.value.nameemail;
    const lines = emailString.split('\n');

    this.accumulatedEmails = lines.map(line => {
      const [name, email] = line.split(',');
      return { name: name.trim(), email: email.trim() };
    }).filter(entry => entry.name && entry.email);

    this.customUserpeopleCount = this.accumulatedEmails.length;

  }
  scheduleLater() {
    this.campaignvisibility = !this.campaignvisibility;
    this.campaignstatus = this.campaignvisibility ? 2 : 1;
    if (!this.campaignvisibility) {
      this.promomailConfiguration.get('scheduled_date')?.reset();
      this.promomailConfiguration.get('scheduled_time')?.reset();
    }
  }
  otherfiles = [];
  otherfilespreview = [];
  closeuploadpopup() {
    this.uploadvisibility = "none";
  }
  openuploadpopup() {
    this.uploadvisibility = "block";
  }
  uploadvisibility = "none";
  otheronFileDropped($event, doctype) {
    this.otherprepareFilesList($event, doctype);
  }
  // otherfileBrowseHandler(files:any, doctype) {
  //   this.otherprepareFilesList(files, doctype);
  // }
  // otherfileBrowseHandler(event: Event, doctype: string) {
  //   const input = event.target as HTMLInputElement;  // Cast event.target to HTMLInputElement
  //   if (input.files) {
  //     const filesArray = Array.from(input.files);  // Convert FileList to array
  //     this.otherprepareFilesList(filesArray, doctype);
  //   }
  // }

  otherdeleteFile(index: number) {
    this.otherfiles.splice(index, 1);
  }
  otherfileBrowseHandler(event: Event, doctype: string) {
    const input = event.target as HTMLInputElement;  // Cast event.target to HTMLInputElement
    if (input.files) {
      const filesArray = Array.from(input.files);  // Convert FileList to array
      this.otherprepareFilesList(filesArray, doctype);
    }
  }
  otheruploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.otherfiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.otherfiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.otheruploadFilesSimulator(index + 1);
          } else {
            this.otherfiles[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  otherformatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  otherprepareFilesList(files: Array<any>, doctype) {
    for (const item of files) {
      const file: File = item;
      item.progress = 0;
      this.otherfiles.push(item);
    }
    this.otheruploadFilesSimulator(0);
  }
  sendpromomail() {
    console.log(this.otherfiles);


    this.submitted = true;
    if (this.promomailConfiguration.invalid) {
      console.log("Comes in");

      return;
    }
    if (this.htmlContent == null || this.htmlContent == "") {

      alert("Message is Required");
      return;
    }
    let email = "";
    this.promomailConfiguration.value.Emailids.forEach((emailid) => {
      email += emailid["email"] + ",";
    });
    if (email == "") {

      alert("Select atleast one mail id for the campaign");
      return;
    }
    const roleTypePayload = this.generateRoleTypePayload();
    const userData = this.allSelectedEmails.map(user => ({ name: user.name, email: user.email, lastSendDateTime: user.lastSendDateTime }));
    this.selectedEmailsList = this.selectedEmails.map(res => ({ email: res.email, name: res.name, lastSendDateTime: res.lastSendDateTime }));
    var msgdata = {
      userData: this.sendEmailsLists,
      subject: this.promomailConfiguration.value.Subject,
      message: this.promomailConfiguration.value.Content,
      //userid: localStorage.getItem("userid"),
      scheduleddate: this.promomailConfiguration.value.scheduled_date,
      scheduledtime: this.promomailConfiguration.value.scheduled_time,
      immediate: this.campaignstatus,
      attachment: this.otherfiles.length > 0 ? this.otherfiles : [],
      roletypes: roleTypePayload
    };
    console.log(">>>FORM<<<", this.promomailConfiguration.value);
    this.service.sendPromomail(msgdata).subscribe(
      (res) => {
        if (this.campaignstatus === 1) {
          alert("Email Sent Successfully");
          //this.getMailHistory();
          setTimeout(() => {
            this.tabindexes = 2;
          }, 2000);
          this.promomailConfiguration.reset();
        } else {
          alert(" Email Saved Successfully");
          this.GetDraftsList();
          setTimeout(() => {
            this.cd.detectChanges();
            this.tabindexes = 1;
          }, 0);
        }
      },
      (error) => {
        alert("Failed , Please Contact Support Team");

      }
    );
    this.promomailConfiguration.reset();

    localStorage.removeItem('RecipientsTypes');

    // if (this.editPromoEmail) {
    //   this.campaignstatus = 2;
    //   var drafteditmsg = {
    //     id: localStorage.getItem("id"),
    //     userData: userData,
    //     subject: this.promomailConfiguration.value.Subject,
    //     message: this.promomailConfiguration.value.Content,
    //     userid: localStorage.getItem("userid"),
    //     scheduleddate: this.promomailConfiguration.value.scheduled_date,
    //     scheduledtime: this.promomailConfiguration.value.scheduled_time,
    //     immediate: this.campaignstatus,
    //     attachment: this.otherfiles.length > 0 ? this.otherfiles : [],
    //     roletypes: roleTypePayload
    //   };

    //   this.emailservice.updateDraftEmail(drafteditmsg).subscribe((response) => { response })
    //   this.tabindex = 1;
    //   this.GetDraftsList();
    // }
    //   this.GetDraftsList();

  }
  //SCHEDULED DRAFTS
  GetDraftsList() {
    const id = { id: localStorage.getItem("userid") }
    this.service.DraftsList(id).subscribe((response) => {
      this.draftsdata = response.emails;
      // this.extractAttachmentNames();    
    });
  }
  roletypesDisplayName: any;
  readonly roleTypeMappings: { [key: number]: string } = {
    1: 'MyLeads',
    2: 'Partners',
    3: 'Custom Users'
  };
  updatePromoEmail(id: any) {
    this.campaignstatus = 2;
    localStorage.setItem("id", id.toString());
    this.campaignvisibility = true
    this.tabindexes = 2;
    setTimeout(() => {
      this.cd.detectChanges();
      this.tabindexes = 2;
    }, 0);
    this.service.DraftsList(id).subscribe((data) => {
      this.tabindexes = 2;
      const emailData = data.emails.find((email) => email.id === id);
      const roletypesData = emailData.roletypes;
      // const matchingOption = this.selectedData.find(option => option.value === roletypesData.toString());
      // const matchingOption = this.selectedData.find(option => {
      //   return option.value === roletypesData;
      // });
      const matchingOption = this.selectedData.find(option => {
        if (typeof option.value === 'number') {
          return option.value === roletypesData.toString();
        } else if (typeof option.value === 'string') {
          return option.value;
        }
        return false;
      });
      if (matchingOption) {
        this.roletypesDisplayName = matchingOption.label;
        this.selectedmailertype = [matchingOption.value];
        this.promomailConfiguration.patchValue({
          type: this.selectedmailertype
        });
      } else {
        this.roletypesDisplayName = null;
      }

      if (emailData) {
        this.tabindexes = 0;
        const userData = JSON.parse(emailData.userdata);
        this.allSelectedEmails = userData.map(user => ({ email: user.email, name: user.name, lastSendDateTime: user.lastSendDateTime }));
        const tempEmail = userData;
        this.tempEmailIds = tempEmail.map(email => ({ label: email.email, value: email.email }));
        this.promomailConfiguration.get('Emailids').setValue(userData.map(user => user.email));
        this.promomailConfiguration.patchValue({
          Subject: emailData.subject,
          Content: emailData.message,
          userid: localStorage.getItem("userid"),
          scheduled_date: emailData.scheduleddate,
          scheduled_time: emailData.scheduledtime,
          attachment: emailData.attachment,
        });
      }
    })
  }
  draftsaction(draftsId) {
    const deleteId = {
      id: draftsId
    }
    if (window.confirm("Are you sure do you want to delete?")) {
      this.service.deletedrafts(deleteId).subscribe(
        (res) => {
          this.toastr.add({ severity: res.status, summary: res.status, detail: res.message });
          this.GetDraftsList();
        });
    }
  }
  getSendername: any[] = [];
  getUser() {
    this.authservice.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        this.getSendername = res
      })
  }
  sendBy: any = 12
  submitFilteredDrafts() {
    this.filterDraftsDialogVisible = false;
    const draftData = {
      fromDate: this.filterDraftsForm.value.fromdate,
      toDate: this.filterDraftsForm.value.todate,
      sendBy: this.sendBy,
      sendTo: this.filterDraftsForm.value.sentto,
      role: this.filterDraftsForm.value.recipients,
      sendTime: this.filterDraftsForm.value.senttime,
    }
    this.service.DraftsList(draftData).subscribe((response) => {
      this.draftsdata = response.emails;
    });
  }
  resetDraftsFilterDialog() {

    this.filterDraftsForm.reset();
    this.GetDraftsList();

  }
  selectedDrafts: number[] = [];
  onCheckboxChange(event: any) {
    const draftId = event.target.value;
    if (event.target.checked) {
      this.selectedDrafts.push(draftId);
    } else {
      const index = this.selectedDrafts.indexOf(draftId);
      if (index > -1) {
        this.selectedDrafts.splice(index, 1);
      }
    }
  }
  deleteSelectedDrafts() {
    if (this.selectedDrafts.length === 0) {
      alert('No drafts selected!');
      return;
    }
    if (window.confirm('Are you sure you want to delete the selected drafts?')) {
      this.selectedDrafts.forEach(draftId => {
        const deleteId = { id: draftId };
        this.service.deletedrafts(deleteId).subscribe((res) => {
          this.toastr.add({ severity: res.status, summary: res.status, detail: res.message });
          this.GetDraftsList();
        });
      });
      this.selectedDrafts = [];
    }
  }
  //HISTORY
  currentPageno: number = 0;
  currentPerpage: number = 10;
  getMailHistory(pageIndex: number = this.currentPageno, pageSize: number = this.currentPerpage) {
    var data = {
      perpage: pageSize,
      pageno: pageIndex
    }
    this.service.HistoryList(data).subscribe((response) => {
      this.messageHistory = response.emails;
      this.totalSentMails = response.count;
      this.totalClicked = response.totalclicked;
      this.totalOpened = response.totalopened;
      this.totalUnsubscribed = response.totalunsubscribed;
    });
  }
  submitFilteredHistory() {
    this.filterHistoryVisible = false;
    const historyData = {
      perpage: 10,
      pageno: 0,
      fromDate: this.filterHistoryForm.value.fromdate,
      toDate: this.filterHistoryForm.value.todate,
      sendBy: this.filterHistoryForm.value.sentby,
      sendTo: this.filterHistoryForm.value.sentto,
      recipient: this.filterHistoryForm.value.recipients
    }
    this.service.HistoryList(historyData).subscribe((response) => {
      this.messageHistory = response.emails;

    });

  }
  resetHistoryFilter() {
    this.filterHistoryForm.reset();
    this.getMailHistory();
    this.filterHistoryVisible = false;
  }
  onCheckboxHistoryChange(event: any) {

  }
  unsubscribers: any[] = [];
  unsubscribedCount = 0;
  unsubscriberName: any;
  getSenderEmail: any;
  getRoleType: any;
  getUserType: any;
  getSubscribedTime: any;
  getSubscribedDate: any;
  filterUnsubscribersVisible: boolean = false;
  //UNSUBSCRIBERS
  getUnsubscribersList() {
    const id = {
      id: localStorage.getItem("userid")
    }
    this.service.getUnsubscribers(id).subscribe((response) => {
      this.unsubscribers = response.unsubscribed;
      this.unsubscribedCount = response.count;
      this.unsubscriberName = [
        { id: null, name: 'Select' },
        ...this.unsubscribers.map((unsubscriber, index) => ({
          id: index + 1,
          name: unsubscriber.name
        }))
      ];
      this.getSenderEmail = [
        { id: null, email: 'Select' },
        ...this.unsubscribers.map((unsubscriber, index) => ({
          id: index + 1,
          email: unsubscriber.email
        }))
      ];
      this.getRoleType = [
        { id: null, roletype: 'Select' },
        ...this.unsubscribers.map((unsubscriber, index) => ({
          id: index + 1,
          roletype: unsubscriber.roletype
        }))
      ];
      this.getUserType = [
        { id: null, usertype: 'Select' },
        ...this.unsubscribers.map((unsubscriber, index) => ({
          id: index + 1,
          usertype: unsubscriber.usertype
        }))
      ];


    });
  }
  exportSubscribers() {

    const formValues = this.filterUnsubscribersForm.value;
    let data = {

      // page: this.page,
      // perPage: this.pageSize
    };

    // this.service.exportCourse(data).subscribe(res =>{
    //   if(res.link){
    //     window.open(res.link, '_blank');
    //   }
    // });
  }
  submitFilteredUnsubscribers() {
    this.filterUnsubscribersVisible = false;
    let roletype = this.filterUnsubscribersForm.value.roletype;
    let usertype = this.filterUnsubscribersForm.value.usertype;
    let name = this.filterUnsubscribersForm.value.name;
    let email = this.filterUnsubscribersForm.value.email;
    if (name === 'Select') {
      name = '';
    }
    if (email === 'Select') {
      email = '';
    }
    if (roletype === 'Select') {
      roletype = '';
    }
    if (usertype === 'Select') {
      usertype = '';
    }
    const data = {
      name: name,
      email: email,
      roletype: roletype,
      usertype: usertype,
      unsubscribeddate: this.filterUnsubscribersForm.value.unsubscribeddate,
      unsubscribedtime: this.filterUnsubscribersForm.value.unsubscribedtime
    }
    this.service.getUnsubscribers(data).subscribe((response) => {
      this.unsubscribers = response.unsubscribed;
      this.unsubscribedCount = response.count;


    });
  }
  resetUnsubscribersFilter() {
    this.filterUnsubscribersForm.reset();
    this.getUnsubscribersList();
    this.filterUnsubscribersVisible = false;
  }
  valueUnsubscribersFilter: string | undefined;
  valuesearchClick() {
    this.valueUnsubscribersFilter = "";
    let searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;

  }
  performSearch(events: any) {
    var data = {
      name: this.valueUnsubscribersFilter,
    };
    this.service.getUnsubscribers(data).subscribe((response) => {
      this.unsubscribers = response.unsubscribed;
      this.unsubscribedCount = response.count;

    });
  }

}
