import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
// Define the URL for the API endpoint
  url: string = environment.apiURL;

// Define the JSON header for HTTP requests
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

// Constructor for the class that takes in an instance of HttpClient
  constructor(private http: HttpClient) {
  }

// Function to generate a report based on some data
  // tslint:disable-next-line:typedef
  generateReport(data: any) {
// Send a POST request to the generateReport endpoint with the provided data and JSON header
    return this.http.post(`${this.url}/bill/generateReport`, data, this.jsonHeader);
  }

// Function to retrieve a PDF based on some data
  getPDF(data: any): Observable<Blob> {
// Send a POST request to the getPDF endpoint with the provided data and options to return a Blob response
    return this.http.post(`${this.url}/bill/getPDF`, data, {
      responseType: 'blob',
    });
  }

// Function to retrieve all bills
  // tslint:disable-next-line:typedef
  getBills() {
// Send a GET request to the getBills endpoint
    return this.http.get(`${this.url}/bill/getBills`);
  }

// Function to delete a bill with a specific ID
  // tslint:disable-next-line:typedef
  delete(id: any) {
// Send a DELETE request to the delete endpoint with the provided ID and JSON header
    return this.http.delete(`${this.url}/bill/delete/${id}`, this.jsonHeader);
  }
}
