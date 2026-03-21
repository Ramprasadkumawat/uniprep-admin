import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import {SelectModule} from "primeng/select";
import { RolesmanagementService } from './rolesmanagement.service';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
@Component({
    selector: 'uni-rolesmanagement',
    templateUrl: './rolesmanagement.component.html',
    styleUrls: ['./rolesmanagement.component.scss'],
    providers: [ConfirmationService],
    imports: [CommonModule, AccordionModule, ReactiveFormsModule, SelectModule, MultiSelectModule, TableModule, ConfirmPopupModule, DialogModule]
})
export class RolesmanagementComponent implements OnInit {
  activeIndex: number = -1;
  form: FormGroup;
  Editform: FormGroup;
  filterForm: FormGroup;
  employeelist:any[] = [];
  filteremployeelist:any[] = [];
  subrolelist:any[] = [];
  filtersubrolelist:any[] = [];
  presalerolelist:any[] = [];
  bdtregionlist: any[] = [];
  subroleSelected:'';
  presaleRolesDisplay:boolean = false;
  bdtRegionDisplay:boolean  = false;
  submitted = false;
  usersCount=0;
  assignedemployees:any=[];
  first: number = 0;
  pageSize = 10;
  EditFormshow:boolean=false;
  Addformshow:boolean =true;
  activities: any[] = [];
  isModalOpen: boolean = false; 
  @ViewChild('formElm') formElm!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private rolesmanagementservice: RolesmanagementService,
    private toaster: MessageService,
    private confirmationService: ConfirmationService,
  ) {
      this.form = fb.group({
        employee: [null, [Validators.required]],
        subrole: [null, [Validators.required]],
        presaleroles: [[],[]],
        bdtregion: [[], []]
      });
      this.Editform = fb.group({
        employee: [null, [Validators.required]],
        subrole: [null, [Validators.required]],
        presaleroles: [[],[]],
        bdtregion: [[], []]
      });
      this.filterForm = fb.group({
        employee: [[],[]],
        subrole: [[],[]],
      });
      this.form.get('subrole')?.valueChanges.subscribe(value => {
        const selectedOption = this.subrolelist.find(option => option.id === value);
        
        if (!selectedOption) {
          return;
        }
      
        this.form.get('presaleroles')?.clearValidators();
        this.form.get('bdtregion')?.clearValidators();
        this.presaleRolesDisplay = false;
        this.bdtRegionDisplay = false;
      
        if (selectedOption.name === 'Presales') {
          this.presaleRolesDisplay = true;
          this.form.get('presaleroles')?.setValidators([Validators.required]);
          this.form.get('bdtregion')?.setValue(null);
        } else if (selectedOption.name === 'BDT') {
          this.bdtRegionDisplay = true;
          this.form.get('bdtregion')?.setValidators([Validators.required]);
          this.form.get('presaleroles')?.setValue(null);
        }else {
          this.form.get('bdtregion')?.setValue(null);
          this.form.get('presaleroles')?.setValue(null);
        }
      
        this.form.get('presaleroles')?.updateValueAndValidity();
        this.form.get('bdtregion')?.updateValueAndValidity();
      });
      this.Editform.get('subrole')?.valueChanges.subscribe(value => {
        const selectedOption = this.subrolelist.find(option => option.id === value);
        
        if (!selectedOption) {
          return;
        }
      
        this.Editform.get('presaleroles')?.clearValidators();
        this.Editform.get('bdtregion')?.clearValidators();
        this.presaleRolesDisplay = false;
        this.bdtRegionDisplay = false;
      
        if (selectedOption.name === 'Presales') {
          this.presaleRolesDisplay = true;
          this.Editform.get('presaleroles')?.setValidators([Validators.required]);
          this.Editform.get('bdtregion')?.setValue(null);
        } else if (selectedOption.name === 'BDT') {
          this.bdtRegionDisplay = true;
          this.Editform.get('bdtregion')?.setValidators([Validators.required]);
          this.Editform.get('presaleroles')?.setValue(null);
        }else {
          this.Editform.get('bdtregion')?.setValue(null);
          this.Editform.get('presaleroles')?.setValue(null);
        }
      
        this.Editform.get('presaleroles')?.updateValueAndValidity();
        this.Editform.get('bdtregion')?.updateValueAndValidity();
      });
    }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getSubroleList();
    this.getAssignedUserList();
  }

  getEmployeeList() {
    this.rolesmanagementservice.getAllEmployees().subscribe(response => {
      this.employeelist = [{ id: null, name: 'Select' }, ...response];
      this.filteremployeelist = response;
    });
  }

  getSubroleList() {
    this.rolesmanagementservice.getSubroleList().subscribe(response => {
      this.subrolelist = [{ id: null, name: 'Select' }, ...response];
      this.filtersubrolelist = response;
    });
  }

  getPresaleRoleList(userid) {
    var val = {
      userid: userid
    }
    this.rolesmanagementservice.getPresaleRoleList(val).subscribe(response => {
      this.presalerolelist = response;
    });
  }

  getBDTRegionList(userid) {
    var val = {
      userid: userid
    }
    this.rolesmanagementservice.getBDTRegionList(val).subscribe(response => {
      this.bdtregionlist = response;
    });
  }

  getAssignedUserList() {
    var value = {
      perpage: 10,
      page: 1
    };
    this.rolesmanagementservice.getAssignedUserList(value).subscribe(response => {
      this.assignedemployees = response.assignedusers;
      this.usersCount = response.count;
    });
  }

  get f() {
    return this.form.controls;
  }

  get g() {
    return this.Editform.controls;
  }


  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    var data = {
      user_id: value.employee,
      subrole_id: value.subrole,
      presaleroles: value.presaleroles,
      bdtregions: value.bdtregion
    }
    this.rolesmanagementservice.assignUserRole(data).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getAssignedUserList();
    });
  }

  submitFilterForm() {
    const value = this.filterForm.value;
    var data = {
      perpage: 10,
      page: 1,
      user_id: value.employee,
      subrole_id: value.subrole,
    };
    this.rolesmanagementservice.getAssignedUserList(data).subscribe(response => {
      this.assignedemployees = response.assignedusers;
      this.usersCount = response.count;
    });
  }

  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.employee) {
      data.user_id = formData.employee;
    }
    if (formData.subrole) {
      data.subrole = formData.subrole;
    }
    this.rolesmanagementservice.exportAssignedRole(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    var value = {
      page: (event.first / this.pageSize + 1),
    };
    this.rolesmanagementservice.getAssignedUserList(value).subscribe(response => {
      this.assignedemployees = response.assignedusers;
      this.usersCount = response.count;
    });
  }

  edit(value) {
    this.Addformshow = false;
    this.EditFormshow = true;
    this.activeIndex = 0;
    this.Editform.patchValue({
      employee: value.employeeid,
      subrole: value.subrole_id
    })
    this.changesubroleedit();
    if (value.subrole === 'BDT') {
      this.bdtRegionDisplay = true;
      this.presaleRolesDisplay = false;
      this.Editform.get('bdtregion')?.setValidators([Validators.required]);
      this.Editform.get('presaleroles')?.setValue(null);
      this.Editform.get('presaleroles')?.clearValidators();
      const bdtRegions = value.bdtregions ? value.bdtregions.split(',').map(Number) : [];
      this.Editform.get('bdtregion')?.setValue(bdtRegions);
    }
    else if (value.subrole === 'Presales') {
      this.presaleRolesDisplay = true;
      this.bdtRegionDisplay = false;
      this.Editform.get('presaleroles')?.setValidators([Validators.required]);
      this.Editform.get('bdtregion')?.setValue(null);
      this.Editform.get('bdtregion')?.clearValidators();
      const presaleRoles = value.presaleroles ? value.presaleroles.split(',').map(Number) : [];
      this.Editform.get('presaleroles')?.setValue(presaleRoles);
    }else {
      this.presaleRolesDisplay = false;
      this.bdtRegionDisplay = false;
      this.Editform.get('bdtregion')?.setValue(null);
      this.Editform.get('presaleroles')?.setValue(null);
      this.Editform.get('presaleroles')?.clearValidators();
      this.Editform.get('bdtregion')?.clearValidators();
    }
  }

  deleteassigned(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete the assigned role?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var data = {
          id : id
        };
        this.rolesmanagementservice.deleteAssignedRole(data).subscribe(response => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.getAssignedUserList();
        }, error => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  submitEditForm() {
    this.submitted = true;
    if (this.Editform.invalid) {
      return;
    }
    const value = this.Editform.value;
    var data = {
      user_id: value.employee,
      subrole_id: value.subrole,
      presaleroles: value.presaleroles,
      bdtregions: value.bdtregion
    }
    this.rolesmanagementservice.assignUserRole(data).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.Editform.reset();
      this.formElm.nativeElement.reset();
      this.Addformshow = true;
      this.EditFormshow = false;
      this.activeIndex = -1;
      this.getAssignedUserList();
    });
  }

  getactivity(val:any) {
    var data = {
      assignedid : val
    }
    this.rolesmanagementservice.getRoleManagementActivity(data).subscribe(response => {
      this.activities = response || [];
      this.isModalOpen = true;  
    });
  }

  closeModal() {
    this.isModalOpen = false;  
    this.activities = []; 
  }

  changesubrole() {
    const value = this.form.value;
    const subrole = value.subrole;
    const userid = value.employee;
    const selectedOption = this.subrolelist.find(option => option.id === subrole);
    if(userid == null) {
      return;
    }
    else if (selectedOption.name === 'Presales') {
      this.getPresaleRoleList(userid);
    }
    else if (selectedOption.name === 'BDT') {
      this.getBDTRegionList(userid);
    }

  }

  changesubroleedit() {
    const value = this.Editform.value;
    const subrole = value.subrole;
    const userid = value.employee;
    const selectedOption = this.subrolelist.find(option => option.id === subrole);
    if(userid == null) {
      return;
    }
    else if (selectedOption.name === 'Presales') {
      this.getPresaleRoleList(userid);
    }
    else if (selectedOption.name === 'BDT') {
      this.getBDTRegionList(userid);
    }

  }

  nameChange() {
    this.form.get('subrole')?.setValue(null);
  }


}
