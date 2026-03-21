import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { Accordion, AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// import { error } from 'console';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { EventsService } from './events.service';
import { UserFacadeService } from '../users/user-facade.service';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
@Component({
    selector: 'uni-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, MultiSelectModule, PaginatorModule, TooltipModule
    ],
    providers: [ConfirmationService]
})
export class EventsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('accordion', { static: false }) accordion!: Accordion;
  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  btntxt = "Add Event";
  namentxt="Add Event";
  activeIndex = 1;
  countries: country[] = [];
  pageno: number = 1;
  perPage: number = 6;
  region: any = [];
  locations: any = [];
  collegenames:any=[]
  upcomingevent:boolean=false;
  postevent:boolean=false;
  activeButton: number =1;
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder, private datePipe: DatePipe,
    private http: HttpClient, private toastr: MessageService, private cdr: ChangeDetectorRef, private service: EventsService,
    private confirmationService: ConfirmationService) {
    this.form = this.fb.group({
      eventname: ['', [Validators.required]],
      image: [''],
      speakername: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      eventlink: ['', [Validators.required]],
      date: ['', [Validators.required]],
      country: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      region: [''],
      location: [''],
      eventdecription: ['', [Validators.required]],
      eventslot: ['', [Validators.required,]],
      flag: [''],
      collegename:[''],
      id:['']
    });
    this.filterform = this.fb.group({
      eventname: [''],
      country: [''],
      from: [''],
      to: [''],
    });
  }

  ngOnInit(): void {
    this.getRegion();
    this.setActiveButton(this.activeButton)
    this.service.GetCountryList().subscribe((response) => {
      this.countries = response;
    });
    var data = {
      eventname: "",
      country: "",
      from: "",
      to: "",
      perpage: 6,
      page: 1
    }
    this.filtersubmit(data)
  }
  get f() {
    return this.form.controls;
  }
  regionIdForCollegeName:any;
  changeRegion(event: any) {
    const value = event.value.toString();
    this.regionIdForCollegeName=event.value.toString()
    this.getLocationList(value)
  }
  getRegion() {
    this.service.getRegion().subscribe(response => {
      this.region = response;
    });
  }
  getLocationList(value: string) {
    this.service.getLocationByRegion(value).subscribe(response => {
      this.locations = response;
    });
  }
  getCollegeList(value: any) {
    this.service.getCollegeName(value).subscribe(response => {
      this.collegenames = response.data;  
    });
  }
  changeLocation(event:any){    
    var data={
      region: this.regionIdForCollegeName,
      loction:event.value.toString()
    }
    this.getCollegeList(data)
  }
  patsEvent:any[]=[];
  geteventlist: any[] = [];
  totalcount: any;
  totalcountpast:any
  getEventFilter() {
    const formData = this.filterform.value;
    if (!formData.eventname && !formData.country && !formData.from && !formData.to) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    var data = {
      eventname: this.filterform.value.eventname,
      country: this.filterform.value.country,
      from: this.filterform.value.from,
      to: this.filterform.value.to,
      perpage: 6,
      page: 1
    }
    this.filtersubmit(data);
    this.pastEvent(data)
  }
  
  filtersubmit(data) {
    this.service.getlistevent(data).subscribe((res) => {
      this.geteventlist = []
      res.events.forEach((list: any) => {
        var bindingdata = {
          id: list.id,
          eventname: list.eventname,
          companylogo: list.companylogo,
          speakername: list.speakername,
          designation: list.designation,
          eventlink: list.eventlink,
          date: this.datechang(list.date),
          country: list.countryName,
          from: this.timeformatchange(list.from),
          to: this.timeformatchange(list.to),
          eventdescription: list.eventdescription,
          countrylog: list.countryFlag,
          days: list.remainingTime,
          registerusercount: list.registered_users_count,
          slotno:list.eventslots,
          countryid:list.country,
          locationid:list.location,
          regionid:list.region,
          collegeid:list.college_id

        }
        this.geteventlist.push(bindingdata)
        console.log(this.geteventlist);
        
      })
      this.totalcount = res.count
    })

  }
  // pastevent
  pastEvent(data) {
    this.service.getListPastevent(data).subscribe((res) => {
      this.patsEvent = []
      res.events.forEach((list: any) => {
        var bindingdata = {
          id: list.id,
          eventname: list.eventname,
          companylogo: list.companylogo,
          speakername: list.speakername,
          designation: list.designation,
          eventlink: list.eventlink,
          date: this.datechang(list.date),
          country: list.countryName,
          from: this.timeformatchange(list.from),
          to: this.timeformatchange(list.to),
          eventdescription: list.eventdescription,
          countrylog: list.countryFlag,
          days: list.remainingTime,
          registerusercount: list.registered_users_count,
          slotno:list.eventslots,
          countryid:list.country,
          locationid:list.location,
          regionid:list.region,
          collegeid:list.college_id

        }
        this.patsEvent.push(bindingdata)
      })
      this.totalcountpast = res.count
    })

  }
  formattedTime: any;
  timeformatchange(originalTime) {
    const timeArray = originalTime.split(':');
    const date = new Date();
    date.setHours(parseInt(timeArray[0], 10));
    date.setMinutes(parseInt(timeArray[1], 10));
    date.setSeconds(parseInt(timeArray[2], 10));

    // Format the Date object as "10 AM" using Angular's DatePipe
    return this.datePipe.transform(date, 'h:mm a');

  }
  datechang(originalDate) {
    return this.datePipe.transform(originalDate, 'dd MMM yy');
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  indextchange(eve: number) {
    this.activeIndex = eve;
  }
  document: any;
  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.document = file;
      const fileInput = this.fileInput.nativeElement;
    }
    this.form.controls.image.setValue(this.document);
  }
  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.btntxt == "Add Event") {
        var data = {
          eventslots:this.form.value.eventslot,
          eventname: this.form.value.eventname,
          companylogo: this.document,
          speakername: this.form.value.speakername,
          designation: this.form.value.designation,
          eventlink: this.form.value.eventlink,
          date: this.form.value.date,
          country: this.form.value.country,
          from: this.form.value.from,
          to: this.form.value.to,
          eventdescription: this.form.value.eventdecription,
          location: this.form.value.location,
          region: this.form.value.region,
          collegename:this.form.value.collegename
        }
        this.service.addevent(data).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.submitted = false;
            this.document = ""
          }
        })
      }else{
        var data1 = {
          eventslots:this.form.value.eventslot,
          eventname: this.form.value.eventname,
          companylogo: this.document,
          speakername: this.form.value.speakername,
          designation: this.form.value.designation,
          eventlink: this.form.value.eventlink,
          date: this.form.value.date,
          country: this.form.value.country,
          from: this.form.value.from,
          to: this.form.value.to,
          eventdescription: this.form.value.eventdecription,
          location: this.form.value.location,
          region: this.form.value.region,
          collegename:this.form.value.collegename,
          event_id:this.form.value.id
        }
        this.service.updateEvent(data1).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.submitted = false;
            this.document = ""
            this.btntxt = "Add Event"; 
            this.namentxt="Add Event"  
          }
        })
      }
    }
  }

  paginate(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage: this.perPage,
      page: event.page + 1,
      to: this.filterform.value.to,
      from: this.filterform.value.from,
      country: this.filterform.value.country,
    }
    this.filtersubmit(data);
  }
  paginate1(event:any){
      this.pageno = (event.page ?? 0) + 1; 
      this.perPage = event.rows ?? 10;
      let data = {
        perpage: this.perPage,
        page: event.page + 1,
        to: this.filterform.value.to,
        from: this.filterform.value.from,
        country: this.filterform.value.country,
      }
      this.pastEvent(data);
  }
  filterformReset() {
    this.filterform.reset();
    this.ngOnInit()
  }
  registerUser(id: any) {
    this.router.navigate(['registereventuser/',id])
  }
  eventUrl(url: any) {
    window.open(url)
  }
  convertTo24HourFormat(time12: string): string {
    const date = new Date('2000-01-01 ' + time12);
    return this.datePipe.transform(date, 'HH:mm');
  }
  editEvent(eve:any){
    this.activeIndex = 0;
    this.btntxt = "Update"; 
    this.namentxt="Update Event"    
    const value = eve.regionid;
    this.getLocationList(value)    
    var data={
      region: eve.regionid,
      loction:eve.locationid.toString()
    }
    this.getCollegeList(data)
    this.cdr.detectChanges();
    this.form.patchValue({
      eventname: eve.eventname,
      speakername: eve.speakername,
      designation:eve.designation,
      eventlink: eve.eventlink,
      date: this.datePipe.transform(eve.date, 'yyyy-MM-dd'),
      country: parseInt(eve.countryid),
      from: this.convertTo24HourFormat(eve.from),
      to: this.convertTo24HourFormat(eve.to),
      region:eve.regionid,
      location: eve.locationid,
      eventdecription: eve.eventdescription,
      eventslot: eve.id,
      collegename:eve.collegeid,
      id:eve.id
  });
  const urlParts = eve.companylogo.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Fetch the remote file
  fetch(eve.companylogo)
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
  }
  deleteEvent(id:any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"btn-primary",
      rejectButtonStyleClass:"btn-primary",
      accept: () => {
        var data={
          eventsId:id
        }
        this.service.deleteEvents(data).subscribe((res) => {
          this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
          this.ngOnInit()
        });
      }
    });
  }
  // Button styles
  button1Style = {
    'background-color': '#FFFFFF',
    color: '#000000',
    
  };

  button2Style = {
    'background-color': '#FFFFFF',
    color: '#000000'
  };
  setActiveButton(buttonNumber: number): void {
    this.patsEvent=[];
    this.geteventlist=[];
    // Reset styles for both buttons
    this.button1Style = {
      'background-color': '#FFFFFF',
      color: '#000000'
    };

    this.button2Style = {
      'background-color': '#FFFFFF',
      color: '#000000'
    };

    // Set styles for the clicked button
    if (buttonNumber === 1) {
      this.activeButton = 1;
      this.upcomingevent=true;
      this.postevent=false;
      this.button1Style = {
        'background-color': 'var(--p-primary-500)',
        color: '#FFFFFF'
      };
      this.filterform.reset()
      var data = {
        eventname: this.filterform.value.eventname,
        country: this.filterform.value.country,
        from: this.filterform.value.from,
        to: this.filterform.value.to,
        perpage: 6,
        page: 1
      }
      this.filtersubmit(data);
    } else if (buttonNumber === 2) {
      this.activeButton = 2;
      this.postevent=true;
      this.upcomingevent=false;
      this.button2Style = {
        'background-color': 'var(--p-primary-500)',
        color: '#FFFFFF'
      };
      this.filterform.reset()
      let postdata={
        perpage : 6,
        page : 1,
      }
      this.pastEvent(postdata)
    }
  }
}


