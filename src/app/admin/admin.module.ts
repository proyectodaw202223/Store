import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';

import { ProductosComponent } from './pages/productos/productos.component';
import { DetproductosComponent } from './pages/detproductos/detproductos.component';
import { DetitemComponent } from './pages/detitem/detitem.component';
import { DescuentosComponent } from './pages/descuentos/descuentos.component';
import { DetdescuentosComponent } from './pages/detdescuentos/detdescuentos.component';

@NgModule({
  declarations: [
    AdminComponent,
    ProductosComponent,
    DetproductosComponent,
    DetitemComponent,
    DescuentosComponent,
    DetdescuentosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
