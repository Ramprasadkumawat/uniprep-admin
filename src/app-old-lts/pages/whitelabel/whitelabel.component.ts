import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {MultiSelectModule} from 'primeng/multiselect';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {TabsModule} from 'primeng/tabs';
import {WhitelabelService} from './whitelabel.service';
import {MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from "primeng/tooltip";

@Component({
    selector: 'uni-whitelabel',
    templateUrl: './whitelabel.component.html',
    styleUrls: ['./whitelabel.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, MultiSelectModule, PaginatorModule, FormsModule, DialogModule, TooltipModule
    ]
})
export class WhitelabelComponent implements OnInit {
  totalcount:number=0;
  Whitlabellist:any[]=[];
  pageno:number = 1;
  perPage:number = 50;
  activeIndex = 1;
  form: FormGroup;
  filterForm:FormGroup;
  intcountries: any = [];
  domaintype:any=[];
  organizationtype:any[]=[];
  organizationName:any[]=[];
  submitted:boolean = false;
  Dnsvalueshow:boolean=false;
  domailtypeid:any
  fileUploadModal:boolean = false;
  confirmationpopup:string = "none";
  btntxt="Add Whitelabel"
  importFile: any;
  uploadedeimages:any;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputicon') fileInputicon: ElementRef;
  ContinueImport = "block";
  constructor(private service:WhitelabelService,private fb: FormBuilder,private toastr: MessageService) { 
    this.form = this.fb.group({
      orgtype: ['', [Validators.required]],
      image: [''],
      coutryname: ['', [Validators.required]],
      flag: [''],
      organizationname: ['', [Validators.required]],
      // fetchname: ['', [Validators.required]],
      // fetchemail: ['', [Validators.required, Validators.email]],
      // fetchnumber: ['', [Validators.required, this.phoneNumberValidator()]],
      domainname: ['', [Validators.required]],
      domaintype: ['', [Validators.required]],
      cname: ['', [Validators.required]],
      id: ['',],
      icon:[''],
      mail_protocol: ['', [Validators.required]],
      mail_host: ['', [Validators.required]],
      mail_port: ['', [Validators.required]],
      mail_id: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mail_encryption: ['', [Validators.required]],
      mail_from_address: [''],
      mail_name: [''],
    });
    this.filterForm=this.fb.group({
      orgtype: [''],
      coutryname: [''],
      organizationname: [''],
      domaintype: [''],
    });
  }

  ngOnInit(): void {
    this.getWhiteLabel();
    this.getCountriesList();
    this.getinstitute();
    this.domaintype=[
      {id:1,name:"Uniprep Domain"},
      {id:2,name:"customised domain"}
    ]

    setTimeout(() => {
      this.form.patchValue({
        domaintype:1
      })
    },1000);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];

  }
  selectedFile: File | undefined;
  document: any;
  icondoc:any;
  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.document = file;
      this.uploadedeimages=file;
      const fileInput = this.fileInput.nativeElement;
    }
    this.form.controls.image.setValue(this.document);
  }
  async onFileChangeIcon(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.icondoc = file;
      const fileInput = this.fileInputicon.nativeElement;
    }
    this.form.controls.icon.setValue(this.icondoc);
  }


  get f() {
    return this.form.controls;
  }
  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      const pattern = /^[0-9]{10,}$/; // Match 10 or more digits
      if (!pattern.test(phoneNumber)) {
        return { minlength: true };
      }
      return null;
    };
  }
  page: number = 1;
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : event.page + 1,
    }
    this.getWhiteLabel();
  }
  editcountrydetails(list:any){
    this.organizationTypeForUpdation(list)
    this.activeIndex=1;
    this.btntxt = "Update Whitelabel";
    this.organizationName = []
    console.log(list);
    this.form.patchValue({
      orgtype:parseInt(list.organizationtype ),
      coutryname:parseInt(list.country) ,
      // fetchname:list.contactname ,
      // fetchemail: list.contactemail,
      // fetchnumber:list.contactnumber,
      domainname:list.domainname ,
      domaintype:parseInt(list.domaintype ),
      cname:list.cname,
      mail_protocol:list.mail_protocol,
      mail_host:list.mail_host,
      mail_port:list.mail_port,
      mail_id:list.mail_id,
      password:list.password,
      mail_encryption:list.mail_encryption,
      mail_from_address:list.mail_from_address,
      mail_name:list.mail_name,
      id:list.id ,
    })
    const urlParts = list.organizationlogo.split('/');
    const filename = urlParts[urlParts.length - 1];

// Fetch the remote file
    fetch(list.organizationlogo)
      .then(response => response.blob())
      .then(blob => {
        // Create a File object with the extracted filename
        const file = new File([blob], filename, {
          type: blob.type,
          lastModified: new Date().getTime()
        });
        // Now, 'file' is a File object with a dynamic name
        this.document = file
        this.form.controls.image.setValue(this.document);
      })
      .catch(error => {
        console.error('Error fetching the file:', error);
      });
      // patch icon
      const urlPartsicon = list.icon.split('/');
      const filenameicon = urlPartsicon[urlPartsicon.length - 1];
          // Fetch the remote file
    fetch(list.icon)
    .then(response => response.blob())
    .then(blob => {
      // Create a File object with the extracted filename
      const file = new File([blob], filenameicon, {
        type: blob.type,
        lastModified: new Date().getTime()
      });
      // Now, 'file' is a File object with a dynamic name
      this.icondoc = file
      this.form.controls.icon.setValue(this.icondoc);
    })
    .catch(error => {
      console.error('Error fetching the file:', error);
    });
  }
  organizationTypeForUpdation(list:any){
    var data={
      institutetype:list.organizationtype
    }
    this.service.getOrganization(data).subscribe((res) => {
      this.organizationName = res.data
      this.form.patchValue({
        organizationname:parseInt(list.organizationname)
      })
    })
  }
  getWhiteLabel() {
    let data = {
      perpage : this.perPage,
      page : this.pageno,
      country:this.filterForm.value.coutryname,
      organizationname :this.filterForm.value.organizationname,
      domaintype:this.filterForm.value.domaintype,
      organizationtype:this.filterForm.value.orgtype,
    }
    this.service.getWhiteLabel(data).subscribe((response) => {
      this.Whitlabellist=[];
      response.data.forEach((ele: any) => {
        var bindingdata = {
          id:ele.id,
          contactemail:ele.contactemail,
          contactname:ele.contactname,
          contactnumber:ele.contactnumber,
          country:ele.country,
          domainname:ele.domainname,
          domaintype:ele.domaintype,
          organizationlogo:ele.organizationlogo,
          organizationname:ele.organizationname,
          organizationtype:ele.organizationtype,
          status:ele.status,
          cname:ele.cname,
          countryname:ele.countryname,
          orgname:ele.orgname,
          orgtype:ele.orgtype,
          icon: ele.icon,
          mail_protocol: ele.mail_protocol,
          mail_host: ele.mail_host,
          mail_port: ele.mail_port,
          mail_id: ele.mail_id,
          password: ele.password,
          mail_encryption: ele.mail_encryption,
          mail_from_address: ele.mail_from_address,
          mail_name: ele.mail_name
        };
        this.Whitlabellist.push(bindingdata);
      });
      this.totalcount= response.count
    });
  }
  domainameconfirm:any;
  domainlogoconfirmation:any;
  domaintypeconfirm:any;
  domainloginconfirm:any;
  domainregisterconfirm:any;
  organizationnameforconfirmapi:any
  submitForm(){
    this.submitted=true;
    if (this.form.valid) {
      var data = {
        organizationtype: this.form.value.orgtype,
        country: this.form.value.coutryname,
        organizationname: this.form.value.organizationname,
        // contactname: this.form.value.fetchname,
        // contactemail: this.form.value.fetchemail,
        // contactnumber: this.form.value.fetchnumber,
        domaintype: this.form.value.domaintype,
        domainname: this.form.value.domainname,
        organizationlogo: this.document,
        cname:this.form.value.cname,
        icon: this.icondoc,
        mail_protocol: this.form.value.mail_protocol,
        mail_host: this.form.value.mail_host,
        mail_port: this.form.value.mail_port,
        mail_id: this.form.value.mail_id,
        password: this.form.value.password,
        mail_encryption: this.form.value.mail_encryption,
        mail_from_address: this.form.value.mail_from_address,
        mail_name: this.form.value.mail_name
      }
      if (this.btntxt == "Add Whitelabel") {
        this.service.addWhitelabel(data).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            // this.form.reset()
            // this.filterForm.reset()
            this.submitted = false;
            this.document=""
            this.domainameconfirm=res.domain_name
            this.domainlogoconfirmation=res.organization_logo_link
            this.domaintypeconfirm=res.domain_type
            this.domainloginconfirm=res.login_link
            this.domainregisterconfirm=res.register_link
            this.organizationnameforconfirmapi=res.organization_name
            this.confirmationpopup="block"
          }
        })
      } else {
        var updatedata = {
          organizationtype: this.form.value.orgtype,
          country: this.form.value.coutryname,
          organizationname: this.form.value.organizationname,
          // contactname: this.form.value.fetchname,
          // contactemail: this.form.value.fetchemail,
          // contactnumber: this.form.value.fetchnumber,
          domaintype: this.form.value.domaintype,
          domainname: this.form.value.domainname,
          organizationlogo: this.document,
          cname:this.form.value.cname,
          id:this.form.value.id,
          icon: this.icondoc,
          mail_protocol: this.form.value.mail_protocol,
          mail_host: this.form.value.mail_host,
          mail_port: this.form.value.mail_port,
          mail_id: this.form.value.mail_id,
          password: this.form.value.password,
          mail_encryption: this.form.value.mail_encryption,
          mail_from_address: this.form.value.mail_from_address,
          mail_name: this.form.value.mail_name
        }
        this.service.updateWhitelabel(updatedata).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            // this.filterForm.reset()
            this.document=""
            this.submitted = false;
            this.btntxt = "Add Whitelabel";
          }
        })
      }
    }
  }
  textSMTP(){
    let req = {
      mail_protocol: this.form.value.mail_protocol,
      mail_host: this.form.value.mail_host,
      mail_port: this.form.value.mail_port,
      mail_id: this.form.value.mail_id,
      password: this.form.value.password,
      mail_encryption: this.form.value.mail_encryption,
      mail_from_address: this.form.value.mail_from_address,
      mail_name: this.form.value.mail_name,
      message: "Testing SMTP configuration from admin.",
      subject: "Testing SMTP.",
      to_email: "maiyalagan.uniabroad@gmail.com"
    }
    this.service.testSMTPConfig(req).subscribe((response) => {
      console.log(response)
    });
  }


  getCountriesList() {
    this.service.getCountriesList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.country
        };
        this.intcountries.push(bindingdata);
      });
    });
  }
  domainTypeChangr(){
    if(this.form.value.domaintype==1){
      this.Dnsvalueshow=false;
    }else if(this.form.value.domaintype==2){
      this.Dnsvalueshow=true;
    }
  }
  getinstitute() {
    this.organizationtype = []
    this.service.getinstitute().subscribe((res) => {
      this.organizationtype = res.data.filter(item => item.id === 12 || item.id === 13);
    })
  }
  getOrganizationNmae() {
    this.organizationName = []
    var data={
      institutetype:this.form.value.orgtype
    }
    this.service.getOrganization(data).subscribe((res) => {
      this.organizationName = res.data
    })
  }
  exportTable(){
    // let data: any = {};
    //   const formData = this.filterForm.value;
    
    //   if (formData.country) {
    //     data.organizationtype = formData.orgtype;
    //   }
    //   if (formData.head_quarters) {
    //     data.domaintype = formData.domaintype;
    //   }
    //   if (formData.fromdate) {
    //     data.organizationname = formData.organizationname;
    //   }
    //   if (formData.fromdate) {
    //     data.country = formData.coutryname;
    //   }
      var data={
        organizationtype:this.filterForm.value.orgtype,
        domaintype:this.filterForm.value.domaintype,
        country:this.filterForm.value.coutryname,
        organizationname:this.filterForm.value.organizationname,
      }
    this.service.export(data).subscribe((res) =>{
      if(res.link){
        window.open(res.link, '_blank');
      }
    })

  }
  resetForm(){
    this.form.reset();
    this.organizationName=[];
  }
  resetFilterForm(){
    this.filterForm.reset();
    this.ngOnInit()
  }
  filterSubmitForm(){
    this.getWhiteLabel();
  }
  uploadFile(){
    if(this.importFile){
      this.service.whitlabelImport(this.importFile).subscribe((response) => {
        this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
        this.fileUploadModal = false;
        this.importFile = null;
    });
    }
  }
  
  onFileChangeImport(event: any){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.importFile = inputElement.files[0];
    } else {
      this.importFile = null;
    }
  }
  preventPeriod(event: KeyboardEvent) {
    if (event.key === '.') {
      event.preventDefault();
    }
  }

  confirmationSubmit(){
    console.log("none")
    var data={
      institutename:this.organizationnameforconfirmapi
    }
    this.service.getUserdetailsByInstituteName(data).subscribe((res) => {
      if (res) {
        this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.ngOnInit()
        this.form.reset()
        this.confirmationpopup="none"
      }
    })
  }
}
