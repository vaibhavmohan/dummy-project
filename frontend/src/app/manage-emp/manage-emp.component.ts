import { Component, Directive, TemplateRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";
import { CommonService } from './../_services';
import { NotifierService } from "angular-notifier";
import { Router, RouterLinkWithHref } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

// import { MatSelectChange } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';
import * as moment from "moment";

@Component({
  selector: 'app-manage-emp',
  templateUrl: './manage-emp.component.html',
  styleUrls: ['./manage-emp.component.scss']
})
export class ManageEmpComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['name', 'username', "email", 'contact', 'updated_at', 'action'];
  empFormGroup: FormGroup;
  isLoadingResults: boolean = false;
  receivedParentMessages = 'Employee list';
  dataSource: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  deviceTypeList: any[] = [];
  private readonly notifier: NotifierService;
  route: string;
  data: any;
  dataLength: number = 0;
  activeMapDtl: MapData = { lat: 51.673858, lng: 7.815982 };
  update: boolean = false;
  userId: any;
  filterFormGroup: FormGroup;
  selected = 'option2';
  isPrefix = false ;
  API_BASE_URL = environment.apiBaseUrl;
  modalTitle :string ;
  showMapModal: boolean = false;

  @ViewChild('viewDialog') viewDialog: TemplateRef<any>;
  @ViewChild('closebutton') closebutton;

  prefix: any;
  empUserList: any;
    
  constructor(private router: Router, private dialog: MatDialog, private _service: CommonService, private FormBuilder: FormBuilder, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.empFormGroup = this.FormBuilder.group({
      name: [''],
      username: [''],
      email: [''],
      contact: [''],
      password: [''],
      conf_password: [''],
    });
    this.filterFormGroup = this.FormBuilder.group({
      username: [''],
      email: [''],
    });

    this.getEmpNameList();
  }

  getEmpNameList(){
    this._service.postRequestCreator({}, "emp/username-list").subscribe(
      (serviceresponse: any) => {
        if (serviceresponse.code === 200) {
          this.empUserList = serviceresponse.result;
        }
      },
      error => {
        if (error.status === 401) {
          this.router.navigate(["login"]);
          return;
        }
      }
    );
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.getEmpList())).subscribe();
    this.sort.sortChange.pipe(tap(() => this.getEmpList())).subscribe();
    this.getEmpList();
  }

  


  search(pageIndex=undefined){
    this.isLoadingResults = true;
    this.route = "emp/info";
    let data = {
      sort: this.sort.active,
      order: this.sort.direction,
      search : {...this.filterFormGroup.value}
    };

    pageIndex = pageIndex == undefined ? ((this.paginator.pageIndex || 0) + 1) : pageIndex;

    this._service.postPaginatorRequestCreator(data, this.route, pageIndex, this.pageSize).subscribe(
      (serviceresponse: any) => {
        this.isLoadingResults = false;
        if (serviceresponse.code === 200) {
          this.dataSource = serviceresponse.result.data;
          this.pageIndex = serviceresponse.result.current_page - 1;
          this.dataLength = serviceresponse.result.total;

        }
      },
      error => {
        this.isLoadingResults = false;
        if (error.status === 401) {
          this.router.navigate(["login"]);
          return;
        }
      }
    );

  }


  getEmpList(pageIndex=undefined ) {

    this.isLoadingResults = true;
    this.route = "emp/list";
    let data = {
      ...this.empFormGroup.value,
      sort: this.sort.active,
      order: this.sort.direction,
    };

    pageIndex = pageIndex == undefined ? ((this.paginator.pageIndex || 0) + 1) : pageIndex;

    this._service.postPaginatorRequestCreator(data, this.route, pageIndex, this.pageSize).subscribe(
      (serviceresponse: any) => {
        this.isLoadingResults = false;
        if (serviceresponse.code === 200) {
          this.dataSource = serviceresponse.result.data;
          this.pageIndex = serviceresponse.result.current_page - 1;
          this.dataLength = serviceresponse.result.total;

        }
      },
      error => {
        this.isLoadingResults = false;
        if (error.status === 401) {
          this.router.navigate(["login"]);
          return;
        }
      }
    );
  }

  addEmp() {

    this.isLoadingResults = true;
    this.route = "emp/add";
    let data = {
      ...this.empFormGroup.value,
    };

    this._service.postRequestCreator(data, this.route).subscribe(
      (serviceresponse: any) => {
        this.isLoadingResults = false;
        if (serviceresponse.code === 200) {
          Swal.fire({
            title: "Success",
            text: serviceresponse.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#c3e6cb',
            confirmButtonText: 'Ok',
          })
          this.getEmpList();
          this.closeEmpModal();
          this.getEmpNameList();
          this.empFormGroup.reset();
          this.update=false;

        }
        if (serviceresponse.code === 422) {
          Swal.fire({
            title: "warning",
            text: serviceresponse.message,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#c3e6cb',
            confirmButtonText: 'Ok',
          })
        }

      },
      error => {
        this.isLoadingResults = false;
        if (error.status === 401) {
          this.router.navigate(["login"]);
          return;
        }
      }
    );
  }

  patchEmp(row){
    // this.isPrefix = true;
    this.modalTitle="Update Employee"
    this.userId = row.id
    this.empFormGroup.patchValue({
      name: row.name,
      username: row.code,
      email: row.email,
      contact: row.contact_number,
      password: '***',
      conf_password: '***',
    })
    this.update=true;
  }



  editEmp() {

    this.isLoadingResults = true;
    this.route = "emp/update";
    let data = {
      ...this.empFormGroup.value,
      id: this.userId,
    };

		if (data.password == '***') {
			data.password = '';
		}
    if (data.conf_password == '***') {
			data.conf_password = '';
		}

    this._service.postRequestCreator(data, this.route).subscribe(
      (serviceresponse: any) => {
        this.isLoadingResults = false;
        if (serviceresponse.code === 200) {
          Swal.fire({
            title: "Success",
            text: serviceresponse.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#c3e6cb',
            confirmButtonText: 'Ok',
          })
          this.getEmpList();
          this.closeEmpModal();
          this.getEmpNameList();
          this.empFormGroup.reset();
          this.update=false;
        }
        if (serviceresponse.code === 422) {
          Swal.fire({
            title: "warning",
            text: serviceresponse.message,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#c3e6cb',
            confirmButtonText: 'Ok',
          })
        }

      },
      error => {
        this.isLoadingResults = false;
        if (error.status === 401) {
          this.router.navigate(["login"]);
          return;
        }
      }
    );
  }
  openEmpPopup() {

    this.showMapModal = true;
    this.modalTitle = "Add Employee" 
    this.empFormGroup.patchValue({
      name: "",
      username: "",
      email: "",
      contact: "",
      branch: "",
      password: "",
      conf_password: "",
    });
    this.update = false;
  }
  refreshList() {
    this.empFormGroup.patchValue({
      name: "",
      username: "",
      email: "",
      contact: "",
      company: "",
      device: "",
      password: "",
      conf_password: "",
    });
    this.filterFormGroup.patchValue({
      username: "",
      email: "",
    });
    
    this.update = false;
    this.getEmpList();
  }

  clear(){
    this.empFormGroup.patchValue({
      name: "",
      username: "",
      email: "",
      contact: "",
      company: "",
      device: "",
      password: "",
      conf_password: "",
    });
  }


  deleteEmp(row) {
    this.route = 'emp/delete';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want Deleted this Employee!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#163862',
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33'
    }).then(result => {
      if (result.value) {
        this._service.postRequestCreator({ id: row.id, username : row.username }, this.route).subscribe((response: any) => {
          if (response.code === 200) {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#c3e6cb',
              confirmButtonText: 'Ok',
            })
            this.getEmpList();
            this.update=false;
          }
        });
      }
    });
  }

  closeEmpModal(){
    // this.dialog.closeAll();
    this.isPrefix = false;
    this.prefix = "";
    this.showMapModal = false;
  }

}


export interface MapData {
  lat: number;
  lng: number;
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
}
