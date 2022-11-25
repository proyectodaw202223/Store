import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';



@NgModule({
  declarations: [
    ClientComponent,
    ContactComponent,
    AboutComponent,
    ProductsComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    ClientRoutingModule
  ],
  providers: [  ]
})
export class ClientModule { }
