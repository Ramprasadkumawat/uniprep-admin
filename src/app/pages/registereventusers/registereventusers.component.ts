import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {InputTextModule} from "primeng/inputtext";
import {TextareaModule} from "primeng/textarea";
import {PaginatorModule} from "primeng/paginator";
import { FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import { TabsModule } from 'primeng/tabs';
import { RegistereventusersService } from './registereventusers.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
interface location {
  id: number,
  state: string,
  district: string,
  status:number,
  created_at: string,
  updated_at: string
}

@Component({
    selector: 'uni-registereventusers',
    templateUrl: './registereventusers.component.html',
    styleUrls: ['./registereventusers.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, PaginatorModule
    ]
})
export class RegistereventusersComponent implements OnInit {
  eventuserlists: any[] = [];
  datacount: number = 0;
  perPage:number = 10;
  pageno:number = 1;
  fileterform:FormGroup;
  statuses=[]
  locations: location[] = [];
  eventnamelist:any[]=[]
  activeIndex = 1;
  eventUserNameAndLocationHide:boolean=true
  constructor(private service: RegistereventusersService,private formbuilder: FormBuilder, private toastr: MessageService,private route:ActivatedRoute,
    private cdr: ChangeDetectorRef, private zone: NgZone,) {
    this.fileterform = this.formbuilder.group({
      formdate: [''],
      todate: [''],
      eventname: [''],
      location: [''],
      eventstatus: [''],
    })
   }
  ngOnInit(): void { 
  const id = this.route.snapshot.paramMap.get('eventid');
    this.fileterform.patchValue({
      eventname: id
    });
  this.cdr.detectChanges();
  if(this.route.snapshot.paramMap.get('eventid')!==null){
    this.eventUserNameAndLocationHide=false;
  }
    this.service.GetLocationList().subscribe((response) =>{
      this.locations = response;
    });
    this.service.GetEventList().subscribe((response) =>{
      this.eventnamelist = response.data;
    });
    this.statuses = [
      { name: "Live", id: "1" },
      { name: "Expired", id: "0"},
    ];
    let data = {
      perpage : 10,
      page : 1,
      from: this.fileterform.value.formdate,
      to: this.fileterform.value.todate,
      eventname: this.fileterform.value.eventname,
      location: this.fileterform.value.location,
      status:this.fileterform.value.eventstatus
    }
    this.getlist(data);
  }
  getlist(data: any) {
    this.service.getEventUsersList(data).subscribe((response) => {
      this.eventuserlists = []; 
      this.eventuserlists = response.events
      this.datacount = response.count;    
    });
  }
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : event.page + 1,
      from: this.fileterform.value.formdate,
      to: this.fileterform.value.todate,
      eventname: this.fileterform.value.eventname,
      location: this.fileterform.value.location,
      status:this.fileterform.value.eventstatus
    }
    this.getlist(data);
  }
  filterform(){
    const formData = this.fileterform.value
    if (!formData.formdate && !formData.todate  && !formData.eventname  && !formData.location  && !formData.eventstatus) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
  var data={
    perpage : 10,
    page : 1,
    from: this.fileterform.value.formdate,
    to: this.fileterform.value.todate,
    eventname: this.fileterform.value.eventname,
    location: this.fileterform.value.location,
    status:this.fileterform.value.eventstatus
  }
  this.getlist(data)
  }
  resetButton(){
    this.fileterform.reset()
    const id = this.route.snapshot.paramMap.get('eventid');
    this.fileterform.patchValue({
      eventname:id
    })
    let data = {
      perpage : 10,
      page : 1,
      eventname:this.fileterform.value.eventname
    }
    this.getlist(data);
  }
}
