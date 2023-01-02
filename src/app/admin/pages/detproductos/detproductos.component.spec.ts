import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetproductosComponent } from './detproductos.component';

describe('DetproductosComponent', () => {
  let component: DetproductosComponent;
  let fixture: ComponentFixture<DetproductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetproductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
