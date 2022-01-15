import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { err_msg } from "../_helpers/alert";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

import { CommonService } from "../_services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoginError = false;
  isLoader = false;
  errorMsg: string = '';
  passwordType = "password";

  constructor(private formBuilder: FormBuilder, private router: Router, private _service: CommonService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
    if (localStorage.getItem("userToken")) {
      this._service.postRequestCreator("", "logout").subscribe((serviceresponse: any) => { });
    }
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
  }

  togglePasswordFieldType() {

    if (this.passwordType == 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  loginUser() {
    this.isLoader = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.isLoginError = true;
      this.errorMsg = "Please Enter User Id and Password";
      this.isLoader = false;
      return;
    }

    this._service.userLogin(this.loginForm.value).subscribe(
      (serviceresponse: any) => {
        if (serviceresponse.code === 200) {
          localStorage.setItem("userToken", serviceresponse.result.access_token);
          const userDataJSON = JSON.stringify(serviceresponse.result.user_data);
          localStorage.setItem("userData", userDataJSON);

          this.router.navigate(["/dashboard"]);
          return;
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoginError = true;
        this.isLoader = false;
        this.errorMsg = error.error.message;
      }
    );
  }
}
