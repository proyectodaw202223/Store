import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetpedidosComponent } from './detpedidos.component';

describe('DetpedidosComponent', () => {
  let component: DetpedidosComponent;
  let fixture: ComponentFixture<DetpedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetpedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetpedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
