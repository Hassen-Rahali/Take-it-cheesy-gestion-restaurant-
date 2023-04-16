import { Injectable } from '@angular/core';

export interface Menu {
  // Define an interface for the properties of a menu item
  state: string;
  name: string;
  icon: string;
  role: string;
}

// Define an array of menu item objects
const MENUITEMS = [
// Define a menu item for the 'dashboard' state
  { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
// Define a menu item for the 'category' state that is only accessible by users with an 'admin' role
  { state: 'category', name: 'Manage Categories', icon: 'category', role: 'admin' },
// Define a menu item for the 'product' state that is only accessible by users with an 'admin' role
  { state: 'product', name: 'Manage Products', icon: 'inventory_2', role: 'admin' },
// Define a menu item for the 'order' state
  { state: 'order', name: 'Manage Orders', icon: 'list_alt', role: '' },
// Define a menu item for the 'bill' state
  { state: 'bill', name: 'View Bills', icon: 'money', role: '' },
// Define a menu item for the 'user' state that is only accessible by users with an 'admin' role
  { state: 'user', name: 'Manage Users', icon: 'people', role: 'admin' },
];

@Injectable()
export class MenuItems {
// Define a method that returns the array of menu item objects
  getMenuItems(): Menu[] {
    return MENUITEMS;
  }
}
