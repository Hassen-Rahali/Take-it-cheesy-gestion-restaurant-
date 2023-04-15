import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  // Declare a variable named "manageOrderForm" of type "any" that represents a form group
  manageOrderForm: any = FormGroup;

// Declare a variable named "displayedColumns" of type "string[]" that represents an array of column names to be displayed
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];

// Declare a variable named "dataSource" of type "any" that represents the data source for the table
  dataSource: any = [];

// Declare a variable named "categories" of type "any" that represents the categories to be displayed in the form
  categories: any = [];

// Declare a variable named "products" of type "any" that represents the products to be displayed in the form
  products: any = [];

// Declare a variable named "price" of type "any" that represents the price of the product
  price: any;

// Declare a variable named "totalAmount" of type "number" that represents the total amount of the products
  totalAmount = 0;

// Declare a variable named "responseMessage" of type "any" that represents the response message from the server
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private snackBar: SnackbarService
  ) {
  }

  ngOnInit(): void {
    // Call the "start" method on the "ngxService" object to start the loader
    this.ngxService.start();

// Call the "getCategories" method to retrieve categories from the server
    this.getCategories();

// Assign a new form group to the "manageOrderForm" variable using the FormBuilder service.
// tslint:disable-next-line:max-line-length
// The form group has several form controls such as "name", "email", "contactNumber", "paymentMethod", "product", "category", "quantity", "price" and "total".
// Each form control has a default value and an array of validators that define its validation rules.
    this.manageOrderForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

// This function retrieves the list of available categories from the backend API
  // tslint:disable-next-line:typedef
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (resp: any) => {
        this.ngxService.stop(); // Stop the ngx-ui-loader spinner
        this.categories = resp.data; // Store the retrieved categories in the 'categories' array
      },
      (error) => {
        this.ngxService.stop(); // Stop the ngx-ui-loader spinner
// If the error contains a custom message, store it in 'responseMessage', otherwise store a generic error message
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
// Show a snackbar with the error message and error severity
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

// This function retrieves the list of products belonging to a specific category from the backend API
  // tslint:disable-next-line:typedef
  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe(
      (resp: any) => {
        this.products = resp.data; // Store the retrieved products in the 'products' array
// Reset the form controls for price, quantity and total to their default values
        this.manageOrderForm.controls.price.setValue('');
        this.manageOrderForm.controls.quantity.setValue('');
        this.manageOrderForm.controls.total.setValue(0);
      },
      (error) => {
        this.ngxService.stop(); // Stop the ngx-ui-loader spinner
// If the error contains a custom message, store it in 'responseMessage', otherwise store a generic error message
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
// Show a snackbar with the error message and error severity
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Function to get product details by ID
  // tslint:disable-next-line:typedef
  getProductDetails(value: any) {
// Subscribe to getProductDetails method of ProductService
    this.productService.getById(value.id).subscribe(
      (resp: any) => {
// Retrieve the price of the product and update the form
        this.price = resp.data.price;
        this.manageOrderForm.controls.price.setValue(resp.data.price);
// Set the quantity to 1 and calculate the total amount
        this.manageOrderForm.controls.quantity.setValue(1);
        this.manageOrderForm.controls.total.setValue(this.price * 1);
      },
      (error) => {
// Handle error response
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
// Display error message using snackbar
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

// Function to set the quantity of the selected product
// tslint:disable-next-line:typedef
  setQuantity(value: any) {
// Retrieve the form controls for quantity, price, and total amount
    const quantity = this.manageOrderForm.controls.quantity;
    const price = this.manageOrderForm.controls.price;
    const total = this.manageOrderForm.controls.total;
    // Check if the quantity is greater than zero
    if (quantity.value > 0) {
      // Calculate the total amount and update the form
      total.setValue(quantity.value * price.value);
    } else {
      // If quantity is less than or equal to zero, reset the quantity and update the total amount
      quantity.setValue();
      total.setValue(price.value);
    }
  }

  // tslint:disable-next-line:typedef
  // This function checks if the form input for adding a product is valid
  // tslint:disable-next-line:typedef
  validateProductAdd() {
    if (
      this.manageOrderForm.controls.total.value === 0 || // If total value is 0
      this.manageOrderForm.controls.total.value === null || // If total value is null
      this.manageOrderForm.controls.quantity.value <= 0 // If quantity value is less than or equal to 0
    ) {
      return true; // Return true if any of the above conditions are true
    } else {
      return false; // Return false if none of the above conditions are true
    }
  }

// This function checks if the form input for submitting an order is valid
  // tslint:disable-next-line:typedef
  validateSubmit() {
    if (
      this.totalAmount === 0 || // If totalAmount is 0
      this.manageOrderForm.controls.name.value === null || // If name value is null
      this.manageOrderForm.controls.email.value === null || // If email value is null
      this.manageOrderForm.controls.contactNumber.value === null || // If contactNumber value is null
      this.manageOrderForm.controls.paymentMethod.value === null || // If paymentMethod value is null
      !this.manageOrderForm.controls.contactNumber.valid || // If contactNumber value is not valid
      !this.manageOrderForm.controls.email.valid // If email value is not valid
    ) {
      return true; // Return true if any of the above conditions are true
    } else {
      return false; // Return false if none of the above conditions are true
    }
  }

// This function adds the product details to the data source and updates the total amount
  // tslint:disable-next-line:typedef
  add() {
    // Get the form data
    const formData = this.manageOrderForm.value;

    // Find the product name in the data source by ID
    const productName = this.dataSource.find(
      // tslint:disable-next-line:triple-equals
      (e: { id: number; }) => e.id == formData.product.id
    );

    // If the product is not found in the data source
    if (productName === undefined) {
      // Update the total amount
      this.totalAmount += formData.total;

      // Add the new product to the data source
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });

      // Update the data source
      this.dataSource = [...this.dataSource];

      // Display a success message
      this.snackBar.openSnackBar(GlobalConstants.productAdded, 'success');
    } else {
      // If the product is already in the data source, display an error message
      this.snackBar.openSnackBar(
        GlobalConstants.productExistError,
        GlobalConstants.error
      );
    }
  }

// This function handles the delete action for a product in the data source
  // tslint:disable-next-line:typedef
  handleDeletAction(value: any, element: any) {
    // Update the total amount
    this.totalAmount -= element.total;

    // Remove the product from the data source
    this.dataSource.splice(value, 1);

    // Update the data source
    this.dataSource = [...this.dataSource];
  }

// This function submits the order data to generate a report
  // tslint:disable-next-line:typedef
  submitAction() {
    // Start the loading spinner
    this.ngxService.start();

    // Get the form data
    const formData = this.manageOrderForm.value;

    // Create the data object to be submitted to the server
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource),
    };

    // Submit the data to the server to generate the report
    this.billService.generateReport(data).subscribe(
      // If the report is generated successfully
      (resp: any) => {
        // Download the generated report file
        this.downloadFile(resp?.uuid);

        // Reset the order form and data source
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      // If there is an error generating the report
      (error) => {
        // Stop the loading spinner
        this.ngxService.stop();

        // Set the response message to the error message returned by the server
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        // Display the error message
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

// This function downloads the generated report file
// tslint:disable-next-line:typedef
  downloadFile(fileName: any) {
    // Create the data object to be submitted to the server to download the file
    const data = {
      uuid: fileName,
    };

    // Submit the data to the server to download the file
    this.billService.getPDF(data).subscribe((resp: any) => {
      // Save the downloaded file with the specified file name and extension
      saveAs(resp, fileName + '.pdf');

      // Stop the loading spinner
      this.ngxService.stop();
    });
  }}
