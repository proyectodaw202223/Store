import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DescuentosComponent } from './pages/descuentos/descuentos.component';
import { DetdescuentosComponent } from './pages/detdescuentos/detdescuentos.component';
import { DetitemComponent } from './pages/detitem/detitem.component';
import { DetpedidosComponent } from './pages/detpedidos/detpedidos.component';
import { DetproductosComponent } from './pages/detproductos/detproductos.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { ProductosComponent } from './pages/productos/productos.component';



const routes: Routes = [
  {
    path: '', 
    component: AdminComponent,
    children:[
      { path: 'pedidos', component: PedidosComponent },
      { path: 'detpedidos', component: DetpedidosComponent },
      { path: 'productos', component: ProductosComponent},
      { path: 'detproductos', component: DetproductosComponent},
      { path: 'detproductos/:id', component: DetproductosComponent},
      { path: 'detitem/item/:itemId', component: DetitemComponent },
      { path: 'detitem/product/:productId', component: DetitemComponent },
      { path: 'descuentos', component: DescuentosComponent },
      { path: 'detdescuentos', component: DetdescuentosComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
