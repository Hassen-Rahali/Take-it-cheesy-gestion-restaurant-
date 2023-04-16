
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  // Define an array of strings representing the column names to be displayed in the table
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];

// Declare a variable to hold the data source for the table
  dataSource: any;

// Declare a variable to hold the response message from the server
  responseMessage: any;

// Constructor function that injects the necessary services
  constructor(
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private router: Router
  ) {}

// Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
// Start the loading spinner
    this.ngxService.start();

// Call the tableData() method to get the data to display in the table
    this.tableData();
  }
  // This method retrieves the bill data from the backend and populates the table with it
  // tslint:disable-next-line:typedef
  tableData() {
    this.billService.getBills().subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(resp.data); // Set the data source for the table
      }, (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      });
  }

// This method is used to filter the table data based on user input
  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filter the data source with the user input
  }

// This method opens a dialog to view the products of a particular bill
  // tslint:disable-next-line:typedef
  handleViewAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {data: value}; // Set the data for the dialog
    dialogConfig.width = '100%'; // Set the width of the dialog to 100%
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig); // Open the dialog
    this.router.events.subscribe(() => { // Close the dialog if the router event changes (e.g. if the user navigates to a different page)
      dialogRef.close();
    });
  }


  // This method is used to download the PDF report based on the provided value
  // tslint:disable-next-line:typedef
  downloadReportAction(value: any) {
    this.ngxService.start(); // Start the ngxService loader
     // Creating an object 'data' with required properties to send to the API
    const { name, email, uuid, contactNumber, paymentMethod, total, productDetails } = value;
    const data = { name, email, uuid, contactNumber, paymentMethod, totalAmount: total, productDetails };

    this.billService.getPDF(data).subscribe(resp => {
      const filename = `${uuid}.pdf`;
      saveAs(resp, filename); // Save the response (PDF file) with provided uuid as filename
      this.ngxService.stop(); // Stop the ngxService loader
    });
  }

// This method is used to handle the deletion of a product from the table
  // tslint:disable-next-line:typedef
  handleDeleteAction(value: any) {
    // Create a new MatDialogConfig object
    const dialogConfig = new MatDialogConfig();
    // Set the data property of the dialogConfig object with the message to be displayed
    dialogConfig.data = {
      message: 'delete ' + value.name + ' bill',
    };
    // Open the ConfirmationComponent dialog and pass the dialogConfig object
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    // Subscribe to the ConfirmationComponent's onEmitStatusChange event
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        // Start the ngxService loader
        this.ngxService.start();
        // Call the deleteProduct method and pass the id of the product to be deleted
        this.deleteProduct(value.id);
        // Close the ConfirmationComponent dialog
        dialogRef.close();
      }
    );
  }

// This method is used to delete a product from the table
  // tslint:disable-next-line:typedef
  deleteProduct(id: any) {
    // Call the billService's delete method and subscribe to its response
    this.billService.delete(id).subscribe(
      (resp: any) => {
        // Stop the ngxService loader
        this.ngxService.stop();
        // Reload the table data
        this.tableData();
        // Set the response message to be displayed as the message from the API response
        this.responseMessage = resp?.message;
        // Display a success message using the snackBar service
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        // Stop the ngxService loader
        this.ngxService.stop();
        // Set the response message to be displayed as either the error message from the API response or a generic error message
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        // Display an error message using the snackBar service
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
