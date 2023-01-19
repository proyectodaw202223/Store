import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  public header_class: string = 'home_header';
  public loginText: string = 'login';

  constructor(
    private router: Router,
    public loginDialog: MatDialog,
  ) {
    this.setLoginText();
  }

  customerIsLoggedIn(): boolean {
    return ('customerName' in sessionStorage);
  }
  
  setLoginText(){
    if (this.customerIsLoggedIn()){
      this.loginText = `${sessionStorage.getItem("customerName")}`;
    } else {
      this.loginText = 'login';
    }
  }

  openLoginDialog():void{
    const loginDialogRef = this.loginDialog.open(LoginComponent);
    loginDialogRef.afterClosed().subscribe(result => {
      this.setLoginText();
    });
  }

  logOut(){
    sessionStorage.removeItem('customerName');
    sessionStorage.removeItem('customerId');
    this.setLoginText();
    this.router.navigate(['']);
  }

  ngOnInit() {
    window.location.pathname !== '/' ? this.header_class = '' : null;
    // Constantly check the url to set the header class.
    this.router.events.subscribe((events) => {
      if (events instanceof NavigationStart) {
        if (events.url === '/') {
          this.header_class = 'home_header';
        } else {
          this.header_class = '';
        }
      }
    });
  }

}
