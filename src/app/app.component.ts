import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import {  Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pimpoCreaciones';

  public header_class: string = '';

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {

    // Constantly check the url to set the header class.
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd)
      )
      .subscribe(event => {
          if (event.urlAfterRedirects) {
            const url = event.urlAfterRedirects;
            if ((url === '/') )  {
              this.header_class = 'home_header';
            } else {
              this.header_class = '';
            }
          }
      });
  }

}
