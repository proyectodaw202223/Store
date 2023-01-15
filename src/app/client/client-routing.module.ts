import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientComponent } from './client.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { CartComponent } from './pages/cart/cart.component';


const routes: Routes = [
  {
    path: '', 
    component: ClientComponent,
    children:[
      { path: '', component: ClientHomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent},
      { path: 'products', component: ProductsComponent},
      { path: 'products/product/:id', component: ProductDetailsComponent},
      { path: 'account', component: MyAccountComponent},
      { path: 'cart', component: CartComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
