import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  constructor(
    private loginDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    if (!('userRole' in sessionStorage))
      this.loginDialog.open(AdminLoginComponent);
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!('userRole' in sessionStorage))
          this.loginDialog.open(AdminLoginComponent);
      }
    });
  }

}
