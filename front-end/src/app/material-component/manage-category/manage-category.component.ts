import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {CategoryService} from "../../services/category.service";
import {GlobalConstants} from "../../shared/global-constants";
import {MatTableDataSource} from "@angular/material/table";
import {CategoryComponent} from "../dialog/category/category.component";

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
displayedColumns:string[]=['name','edit'];
dataSource:any;
responseMessage:any;
  constructor(
              private router:Router,
              private categoryService:CategoryService,
              private snackbarService:SnackbarService,
              private dialog:MatDialog,
              private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {

    this.ngxService.start();
    this.tableData();
  }
  tableData(){
    this.categoryService.getCategory().subscribe((response:any)=> {
      this.ngxService.stop();
     this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      console.log(error)
      this.ngxService.stop();
      if(error.error?.message)
      {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genricError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      acton:'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }
  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      acton:'Edit',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response)=>{
      this.tableData();
    })
  }
}
