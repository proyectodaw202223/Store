import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';

import { ProductosComponent } from './pages/productos/productos.component';
import { DetproductosComponent } from './pages/detproductos/detproductos.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { DetpedidosComponent } from './pages/detpedidos/detpedidos.component';


@NgModule({
  declarations: [
    AdminComponent,
    ProductosComponent,
    DetproductosComponent,
    PedidosComponent,
    DetpedidosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
