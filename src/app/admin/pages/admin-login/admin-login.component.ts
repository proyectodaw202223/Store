import { Component, OnInit } from '@angular/core';
import { LoginComponent } from 'src/app/client/pages/login/login.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css', '../../admin.component.css']
})
export class AdminLoginComponent implements OnInit {

  public user = new User('', '', '');

  constructor(
    private userService: UserService,
    private loginDialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    if ('adminRole' in sessionStorage)
      this.loginDialogRef.close();
  }

  login(): void {
    if (this.user.email === "" || this.user.password === "")
      return;

    this.userService.getUserByEmailAndPassword(this.user).subscribe({
      next: (result) => {
        this.user = result as User;
        sessionStorage.setItem('userRole', this.user.role);
        this.loginDialogRef.close();
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

}
