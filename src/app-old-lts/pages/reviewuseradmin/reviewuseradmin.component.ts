import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import { FormsModule , FormGroup , FormControl , FormBuilder , NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewuseradminService } from "src/app/pages/reviewuseradmin/reviewuseradmin.service";
import {MessageService} from "primeng/api";
import {PaginatorModule} from 'primeng/paginator';

@Component({
    selector: 'uni-reviewuseradmin',
    imports: [CommonModule, AccordionModule, TableModule, ReactiveFormsModule, FormsModule, PaginatorModule],
    templateUrl: './reviewuseradmin.component.html',
    styleUrls: ['./reviewuseradmin.component.scss']
})
export class ReviewuseradminComponent implements OnInit {
  userform: FormGroup;
  orglist: any;
  users: any;
  showform = false;
  updateBtn:boolean = false;
  addBtn:boolean = true;
  password:boolean = true;
  password_confirmation:boolean = true;
  editUserId: number;
  submitted:boolean = false;
  pshow:boolean = false;
  pass:string = "password";
  cpshow:boolean = false;
  cpass:string = "password";
  perPage:number = 10;
  page:number = 1;
  count:number;
  countries:any;
  filterForm: FormGroup;
  headName: string = "Add Review User";
  selectedCountry:any;

  constructor(private formbuilder: FormBuilder , private service: ReviewuseradminService,private toastr: MessageService) {



   }

  ngOnInit(): void {

    this.getAllUsers();
    this.getCountries();

    this.userform = this.formbuilder.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      phone:['',Validators.required],
      gender:['',Validators.required],
      password:['', [Validators.required,Validators.min(8)]],
      password_confirmation:['',Validators.required],
      source:['',Validators.required]
    })

    this.filterForm = this.formbuilder.group({
      user_name:['',Validators.required],
      email:['',Validators.required],
      phone:['',Validators.required],
      country_id:['',Validators.required],
      organization:['',Validators.required]
    })

    // this.userform = new FormGroup({
    //   name:new FormControl(),
    //   email:new FormControl(),
    //   phone:new FormControl(),
    //   gender:new FormControl(),
    //   password:new FormControl(),
    //   password_confirmation:new FormControl(),
    //   source:new FormControl(),
    // })

    this.password = true;
    this.password_confirmation = true;
  }


  countrySelect(){
    // alert(this.selectedCountry);
    let countries = {
    country :this.selectedCountry,
    }
    this.getallorgs(countries);
  }

  getallorgs(countries){
    this.service.GetOrgList(countries).subscribe((res) => {
      this.orglist = res.users;
    })
  }

  adduser(){

    // console.log(this.userform);

    this.submitted = true;

    let userdata = {
      name: this.userform.value.name,
      email: this.userform.value.email,
      phone:this.userform.value.phone,
      gender: this.userform.value.gender,
      password: this.userform.value.password,
      password_confirmation: this.userform.value.password_confirmation,
      source: this.userform.value.source
    }

    if (userdata.password !== userdata.password_confirmation) {
      this.toastr.add({severity: 'error', summary: 'Error', detail: "The password field confirmation does not match"});
      return;
    }
    this.service.AdminAddReviewUser(userdata).subscribe((response) => {
      // alert(response)
      this.getAllUsers();
      this.toastr.add({severity: 'success', summary: 'Success', detail: "User Created"});
      this.userform.reset();
      this.submitted = false;
     }); 
  }

  resetForm(){
    this.userform.reset();
    this.getAllUsers();
    this.submitted = false;
  }

  resetFilterForm(){
    this.filterForm.reset();
    this.getAllUsers();
  }

  getAllUsers(){
    let data = {
      perpage:this.perPage,
      page:1
    }
    this.service.GetAllReviewUsers(data).subscribe((response) => {
      this.users = response.users
      this.count = response.count
     }); 
  }

  paginate(event: any){
    let data = {
      perpage:event.rows,
      page:event.page + 1,
      user_name : this.filterForm.value.user_name,
      email: this.filterForm.value.email,
      phone: this.filterForm.value.phone,
      country_id: this.filterForm.value.country_id,
      organization: this.filterForm.value.organization,
    }
    this.service.GetAllReviewUsers(data).subscribe((response) => {
      this.users = response.users
      this.count = response.count
    }); 
  }

  deleteUser(id){
    let data = {
      id : id
    }
    this.service.DeleteUser(data).subscribe((response) => {
      this.toastr.add({severity: 'success', summary: 'Success', detail: "User Removed"});
      this.getAllUsers();

    });
  }

  edituser(id ,name ,email,phone,gender ,Organization,source){
    this.showform = true;
    this.userform.patchValue({
       name: name,
       email: email,
       phone: phone,
       gender: gender,
       source: source,
      });

      this.editUserId = id;
      this.updateBtn = true;
      this.addBtn = false;
      this.password = false;
      this.password_confirmation = false;
      this.headName = "Edit Review User" ;
  }

  updateUser(){
    let userdata = {
      userId:this.editUserId,
      name: this.userform.value.name,
      email: this.userform.value.email,
      phone:this.userform.value.phone,
      gender: this.userform.value.gender,
      source: this.userform.value.source
    }
    this.service.UpdateUser(userdata).subscribe((response) => {
      this.toastr.add({severity: 'success', summary: 'Success', detail: "User Updated"});
       this.getAllUsers()
       this.userform.reset();
       this.submitted = false;
    });

    this.headName = "Add Review User" 
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

  getCountries(){
    this.service.GetCountries().subscribe((res) => {
      this.countries = res;
    });
  }

  filterUsers(){
    let data = {
      perpage:this.perPage,
      page:this.page,
      user_name : this.filterForm.value.user_name,
      email: this.filterForm.value.email,
      phone: this.filterForm.value.phone,
      country_id: this.filterForm.value.country_id,
      organization: this.filterForm.value.organization,
    }
    this.service.GetAllReviewUsers(data).subscribe((response) => {
      this.users = response.users
      this.count = response.count
    }); 
  }
}