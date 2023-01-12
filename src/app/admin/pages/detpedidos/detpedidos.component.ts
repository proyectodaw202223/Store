import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-detpedidos',
  templateUrl: './detpedidos.component.html',
  styleUrls: ['./detpedidos.component.css', '../../admin.component.css']
})
export class DetpedidosComponent implements OnInit {

  public order = new Order(1, 1, '', '', '');
  private isEditing = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.isEditing = (params['id']) ? true : false;

      if (this.isEditing) {
        this.getOrder(params['id']);
      }
    });
  }

  getOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (result) => {
        this.order = result as Order;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  onNewOrderButtonClick(event: Event): void {
    this.router.navigate(['detpedidos']);
  }

  onDeleteOrderButtonClick(event: Event): void {
    if (!window.confirm("Se eliminará el pedido " + this.order.id + ", ¿Desea continuar?"))
      return;

    if (this.order.id !== undefined)
      this.deleteOrder(this.order.id);
    
    this.router.navigate(['detpedidos']);
  }

  deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: (result) => {
        this.router.navigate(['detpedidos']);
        console.log("Order " + orderId + " successfully deleted.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  onSaveOrderButtonClick(event: Event): void {
    if (this.isEditing) {
      if (this.validateUpdateOrder())
        this.updateOrder();
    } else {
      if (this.validateCreateOrder())
        this.createOrder();
    }
  }

  validateCreateOrder(): boolean {
    if (!this.order.status) {
      window.alert("El campo estado es obligatorio.");
      return false;
    }

    return true;
  }

  createOrder(): void {
    this.orderService.createOrder(this.order).subscribe({
      next: (result) => {
        this.order = result as Order;
        this.isEditing = true;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  validateUpdateOrder(): boolean {
    if (!this.order.id || !this.order.updated_at) {
      window.alert("Se produjo un error inesperado.");
      return false;
    }

    return this.validateCreateOrder();
  }

  updateOrder(): void {
    console.log(this.order);
    this.orderService.updateOrder(this.order).subscribe({
      next: (result) => {
        this.order = result as Order;
        alert("Pedido actualizado correctamente");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  onSelectAllItemsCheckboxChange(event: Event): void {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-item-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }
}