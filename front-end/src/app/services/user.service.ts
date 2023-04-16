import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  // tslint:disable-next-line:typedef
  signup(data: any) {
    return this.http.post(`${this.url}/user/signup`, data, this.jsonHeader);
  }

  // tslint:disable-next-line:typedef
  forgotPassword(data: any) {
    return this.http.post(
      `${this.url}/user/forgotPassword`,
      data,
      this.jsonHeader
    );
  }

  // tslint:disable-next-line:typedef
  login(data: any) {
    return this.http.post(`${this.url}/user/login`, data, this.jsonHeader);
  }

  // tslint:disable-next-line:typedef
  checkToken() {
    return this.http.get(`${this.url}/user/checkToken`);
  }

  // tslint:disable-next-line:typedef
  changePassword(data: any) {
    return this.http.post(
      `${this.url}/user/changePassword`,
      data,
      this.jsonHeader
    );
  }

  // tslint:disable-next-line:typedef
  getUsers() {
    return this.http.get(`${this.url}/user/get`);
  }

  // tslint:disable-next-line:typedef
  update(data: any) {
    return this.http.patch(`${this.url}/user/update`, data, this.jsonHeader);
  }
}
