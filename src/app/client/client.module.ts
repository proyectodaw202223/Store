import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';



@NgModule({
  declarations: [
    ClientComponent,
    ContactComponent,
    AboutComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [  ]
})
export class ClientModule { }
