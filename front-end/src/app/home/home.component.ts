import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {ForgetPasswordComponent} from "../forget-password/forget-password.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  signupAction(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "550px";
  this.dialog.open(SignupComponent,dialogConfig)
  }

  forgetPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ForgetPasswordComponent,dialogConfig)
  }
}
