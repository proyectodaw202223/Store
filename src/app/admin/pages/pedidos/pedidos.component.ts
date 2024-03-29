import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { OrderStatus } from 'src/app/models/orderStatus.model';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css', '../../admin.component.css']
})
export class PedidosComponent implements OnInit {

  public ordersMap = new Map<number, Order>();
  public filteredOrdersMap = new Map<number, Order>();
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      window.location.replace('/admin');
      
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getAllOrders().subscribe({
        next: (result: Array<Order>) => {
          result = result.filter(r => r.status != OrderStatus.CREATED);

          this.ordersMap = new Map(
            result.map((order) => [(order.id === undefined) ? 0 : order.id, order]
          ));

          this.filteredOrdersMap = new Map(this.ordersMap);
        },
        error: (error) => {
          window.alert(error.error.error);
          console.error(error);
        }
    });
  }

  onFilterChange(event: Event): void {
    var statusFilter = document.querySelector("#status-filter") as HTMLSelectElement;
    var status = statusFilter.selectedOptions[0].value;

    this.filteredOrdersMap.clear();

    this.ordersMap.forEach((order) => {
      if ((order.status == status) || !status)
      {
        this.filteredOrdersMap.set((order.id === undefined) ? 0 : order.id, order);
      }
    });
  }

  onNewProductButtonClick(event: Event): void {
    this.router.navigate(['detproductos']);
  }

  onDeleteProductButtonClick(event: Event): void {
    if (!window.confirm("Se eliminarán los productos seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-product-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var orderId = checkboxCollection.item(i)?.value;

      if (orderId === undefined)
        continue;

      this.deleteOrder(parseInt(orderId));
    }
  }

  deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: (result) => {
        this.ordersMap.delete(orderId);
        this.filteredOrdersMap.delete(orderId);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }
}
