import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
// import * as CryptoJS from "crypto-js";  


@Injectable()
export class CommonService {
  API_URL = environment.apiUrl;
  GOOGLE_KEY = '';
  NODE_API_URL = '';
  PRINT_URL = 'http://localhost/PTX.php';
  PRINT_URL_A2A = 'http://localhost/PTX_A2A.php';
  constructor(private _http: HttpClient) {}

  userLogin(login) { 
  // let encPassword='123w';
  // let pass =login.password.trim();
  // let passwordEncrypted =CryptoJS.AES.encrypt(pass,encPassword);
  


    const data = { email: btoa(login.name), password:btoa(login.password) , isWeb: true };
    return this._http.post(this.API_URL + "/login", data);
  }

  getUserData(): Observable<{}> {
    const header = new HttpHeaders();
    const other_header = header.append("Authorization", "Bearer" + localStorage.getItem("userToken"));
    return this._http.post<{}>(this.API_URL + "/user", "", { headers: other_header });
  }

  forgetPassword(login) {
    const data = { email: login.email };
    return this._http.post(this.API_URL + "/password/create", data);
  }

  postRequestCreator(param, route, NODE_API=false): Observable<{}> {
    const header = new HttpHeaders();
    const other_header = header.append("Authorization", "Bearer" + localStorage.getItem("userToken"));
    if (typeof param == "object" && !param.mode) {
      param.mode = "WEB";
    }

    let base_url = '';
    if(NODE_API){
      base_url = this.NODE_API_URL;
    }else{
      base_url = this.API_URL;
    }


    return this._http.post<{}>(base_url + "/" + route, param, { headers: other_header });
  }

  postRequestFileUpload(param, route,NODE_API=false): Observable<{}> {
    const header = new HttpHeaders();
    header.append('Content-Type', 'multipart/form-data');
    header.append('Accept', 'application/json');

    const other_header = header.append("Authorization", "Bearer" + localStorage.getItem("userToken"));
    if (typeof param == "object" && !param.mode) {
      param.mode = "WEB";
    }
    let base_url = '';
    if (NODE_API) {
      base_url = this.NODE_API_URL;
    } else {
      base_url = this.API_URL;
    }
    return this._http.post<{}>(base_url + "/" + route, param, { headers: other_header });
  }

  //API Key To Be Added In Environment File
  getPostalCode(data) {
    return this._http.get("https://maps.googleapis.com/maps/api/geocode/json?key="+this.GOOGLE_KEY+"&region=IN&libraries=drawing,places,visualization&" + data);
  }

  getRequestWithoutToken(data, route) {
    return this._http.get(this.API_URL + "/" + route, {
      params: data
    });
  }
  postRequestWithoutToken(data, route) {
    return this._http.post(this.API_URL + "/" + route, data);
  }

  postPaginatorRequestCreator(param, route, startIndex, pageSize): Observable<{}> {
    const header = new HttpHeaders();
    const other_header = header.append("Authorization", "Bearer" + localStorage.getItem("userToken"));
    if (typeof param == "object" && !param.mode) {
      param.mode = "WEB";
    }
    return this._http.post<{}>(this.API_URL + "/" + route + "?page=" + startIndex + "&limit=" + pageSize, param, { headers: other_header });
  }

  getTrauckLocation(param) {
    const header = new HttpHeaders();
    const other_header = header.append("Authorization", "Bearer" + localStorage.getItem("userToken"));
    const route = "truck-status";
    return this._http.post<{}>(this.API_URL + "/" + route, param, { headers: other_header });
  }

}
