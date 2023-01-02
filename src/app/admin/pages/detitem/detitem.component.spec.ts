import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetitemComponent } from './detitem.component';

describe('DetitemComponent', () => {
  let component: DetitemComponent;
  let fixture: ComponentFixture<DetitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
