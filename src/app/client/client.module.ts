import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { ClientComponent } from './client.component';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientRoutingModule } from './client-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';



@NgModule({
  declarations: [
    ClientComponent,
    ClientHomeComponent,
    ContactComponent,
    AboutComponent,
    ProductsComponent,
    LoginComponent,
    MyAccountComponent,
    CartComponent,
    ProductDetailsComponent,
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
