import { Component, OnInit,Input,Output } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { CommonService } from "../_services";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  user_name = "";
  apk_url = environment.apk_link;
  user_image = "";
  user_created_at: "";
  user_access_role;
  user_email;
  user_contact_number;
  route: string;
  user_id: any;
  warehouseId: any;
  href: any;
  @Input() receivedParentMessage;
  // @Output() vehicleToEmit = new EventEmitter<string>();
  constructor(private router: Router, private _service: CommonService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.href = this.router.url;
    const token = localStorage.getItem("userToken");

    if (!token) {
      this.router.navigate(["login"]);
      return;
    } else {
      const userData = JSON.parse(localStorage.getItem("userData"));
      this.user_name = userData.hasOwnProperty("name") ? userData.name : "Guest";
      this.user_image = userData["user_image"];
      this.warehouseId = userData["warehouse_id"];
    }
  }

  logout() {
    let data = {};
    const token = localStorage.getItem("userToken");
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#163862",
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33"
    }).then(result => {
      if (result.value) {
        this.route = "logout";
        this._service.postRequestCreator(data, this.route).subscribe((response: any) => {
          if (response.code == 200) {
            this.router.navigate(["login"]);
            location.reload();
          }
        });
      }
    });
    // this.router.navigate(['login']);
  }
}
