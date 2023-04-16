import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  // A method that fetches the user data and populates it in a data source for a material table.
  // tslint:disable-next-line:typedef
  tableData() {
    // Call the getUsers() method of the userService which returns an Observable.
    this.userService.getUsers().subscribe(
      // Success callback function that receives the response data.
      (resp: any) => {
        // Stop the loading spinner.
        this.ngxService.stop();
        // Create a new MatTableDataSource object and set the response data as its source.
        this.dataSource = new MatTableDataSource(resp.data);
      },
      // Error callback function that receives the error object.
      (error) => {
        // Stop the loading spinner.
        this.ngxService.stop();
        // Check if the error object has a message property.
        if (error.error?.message) {
          // Set the responseMessage property to the error message.
          this.responseMessage = error.error?.message;
        } else {
          // Set the responseMessage property to a default generic error message.
          this.responseMessage = GlobalConstants.genericError;
        }
        // Display the responseMessage property in a snackbar with an error type.
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

// A method that filters the data in the table based on user input.
  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    // Extract the user input from the event object and convert it to lowercase.
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Set the filter value as the filter property of the data source.
    this.dataSource.filter = filterValue;
  }

// A method that updates the status of a user based on the selected action.
  // tslint:disable-next-line:typedef
  handleChangeAction(status: any, id: any) {
    // Start the loading spinner.
    this.ngxService.start();
    // Create a data object with the updated status and the user ID.
    const data = {
      status: status.toString(),
      id,
    };
    // Call the update() method of the userService which returns an Observable.
    this.userService.update(data).subscribe(
      // Success callback function that receives the response data.
      (resp: any) => {
        // Stop the loading spinner.
        this.ngxService.stop();
        // Set the responseMessage property to the success message in the response.
        this.responseMessage = resp?.message;
        // Display the responseMessage property in a snackbar with a success type.
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      // Error callback function that receives the error object.
      (error) => {
        // Stop the loading spinner.
        this.ngxService.stop();
        // Check if the error object has a message property.
        if (error.error?.message) {
          // Set the responseMessage property to the error message.
          this.responseMessage = error.error?.message;
        } else {
          // Set the responseMessage property to a default generic error message.
          this.responseMessage = GlobalConstants.genericError;
        }
        // Display the responseMessage property in a snackbar with an error type.
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
