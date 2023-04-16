import { Routes } from '@angular/router';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

// Define an array of route objects for the Angular router
export const MaterialRoutes: Routes = [
  {
      path: 'category', // Define a route for the 'category' path
      component: ManageCategoryComponent, // Specify the component that should be displayed when this route is accessed
      canActivate: [RouteGuardService], // Specify a route guard service that determines whether the user is authorized to access this route
      data: { // Define some additional data that can be accessed by the component
        expectedRole: ['admin'], // Define the expected user role for this route
      },
    },
  {
    path: 'product', // Define a route for the 'product' path
    component: ManageProductComponent, // Specify the component that should be displayed when this route is accessed
    canActivate: [RouteGuardService], // Specify a route guard service that determines whether the user is authorized to access this route
    data: { // Define some additional data that can be accessed by the component
      expectedRole: ['admin'], // Define the expected user role for this route
    },
  },
  {
    path: 'order', // Define a route for the 'order' path
    component: ManageOrderComponent, // Specify the component that should be displayed when this route is accessed
    canActivate: [RouteGuardService], // Specify a route guard service that determines whether the user is authorized to access this route
    data: { // Define some additional data that can be accessed by the component
      expectedRole: ['admin', 'user'], // Define the expected user roles for this route
    },
  },
  {
    path: 'bill', // Define a route for the 'bill' path
    component: ViewBillComponent, // Specify the component that should be displayed when this route is accessed
    canActivate: [RouteGuardService], // Specify a route guard service that determines whether the user is authorized to access this route
    data: { // Define some additional data that can be accessed by the component
      expectedRole: ['admin', 'user'], // Define the expected user roles for this route
    },
  },
  {
    path: 'user', // Define a route for the 'user' path
    component: ManageUserComponent, // Specify the component that should be displayed when this route is accessed
    canActivate: [RouteGuardService], // Specify a route guard service that determines whether the user is authorized to access this route
    data: { // Define some additional data that can be accessed by the component
      expectedRole: ['admin'], // Define the expected user role for this route
    },
  },
];
