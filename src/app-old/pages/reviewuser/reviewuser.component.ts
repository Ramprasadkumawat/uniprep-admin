import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule , FormGroup , FormControl , FormBuilder , NgForm ,Validators} from '@angular/forms';
import { ReviewuserService } from "src/app/pages/reviewuser/reviewuser.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'uni-reviewuser',
    imports: [CommonModule, AccordionModule, TableModule, ReactiveFormsModule],
    templateUrl: './reviewuser.component.html',
    styleUrls: ['./reviewuser.component.scss']
})
export class ReviewuserComponent implements OnInit {
  userform: FormGroup;
  usertype: number;
  source: number;
  userlist: any;
  submitted:boolean = false;
  pshow:boolean = false;
  pass:string = "password";
  cpshow:boolean = false;
  cpass:string = "password";
  filterForm: FormGroup;
  constructor(private formbuilder: FormBuilder , private service: ReviewuserService , private toastr: MessageService ) { 

  }

  ngOnInit(): void {
    this.getUsers();
    this.userform = this.formbuilder.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      mobile:['',Validators.required],
      gender:['',Validators.required],
      password:['', [Validators.required,Validators.min(8)]],
      password_confirmation:['',Validators.required],
      source:['',Validators.required]
    })

    this.filterForm = this.formbuilder.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      mobile:['',Validators.required],
    })

  } 

  getUsers(){
    let data;
    this.service.GetReviewUsers().subscribe((res)=>{
      this.userlist = res;
    })
  }


  filterUsers(filterForm:any){
    let filterdata = {
      name: filterForm.controls.name.value,
      email: filterForm.controls.email.value,
      phone: filterForm.controls.mobile.value,
    }
  }

  adduser(userform:any){ 

    this.submitted = true;

    this.service.GetUserData().subscribe((res) => {
      this.usertype = res.userdetails[0].usertype_id
      this.source = res.userdetails[0].source

      let userdata = {
        name: userform.controls.name.value,
        email: userform.controls.email.value,
        phone: userform.controls.mobile.value,
        gender: userform.controls.gender.value,
        password: userform.controls.password.value,
        password_confirmation: userform.controls.password_confirmation.value,
        usertype_id: this.usertype,
        source: this.source,
        location: res.userdetails[0].location_id,
        organizationId : 1,
        designation : ""
      }
  
      this.service.AddReviewUser(userdata).subscribe((res) => {
        this.toastr.add({severity: 'success', summary: 'Success', detail: "User Added"});
        this.getUsers();
      })
    })
  }

  ShowPassword(){
    if(this.pshow == true){
      this.pshow = false;
      this.pass = "password";
    }else{
      this.pshow = true;
      this.pass = "text";
    }
  }

  ConfirmPasswordShow(){
    if(this.cpshow == true){
      this.cpshow = false;
      this.cpass = "password";
    }else{
      this.cpshow = true;
      this.cpass = "text";
    }
  }
}
