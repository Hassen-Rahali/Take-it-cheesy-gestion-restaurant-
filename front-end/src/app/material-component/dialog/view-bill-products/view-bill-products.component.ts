import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss'],
})
export class ViewBillProductsComponent implements OnInit {
  // Define an array of strings that represent the column names to be displayed in a table
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];

// Initialize the dataSource variable to an empty array
  dataSource: any = [];

// Declare the data variable without assigning a value
  data: any;

  constructor(
// Inject the MAT_DIALOG_DATA and MatDialogRef services
@Inject(MAT_DIALOG_DATA) public dialogData: any,
public dialogRef: MatDialogRef<ViewBillProductsComponent>) {}


  // tslint:disable-next-line:typedef
  ngOnInit() {
// Set the value of the data variable to the data property of the dialogData object
    this.data = this.dialogData.data;
// Parse the productDetails property of the data object from a JSON string to a JavaScript object and set it to the dataSource variable
    this.dataSource = JSON.parse(this.data.productDetails);
    console.log(this.dataSource);
  }
}
