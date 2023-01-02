import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetdescuentosComponent } from './detdescuentos.component';

describe('DetdescuentosComponent', () => {
  let component: DetdescuentosComponent;
  let fixture: ComponentFixture<DetdescuentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetdescuentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetdescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
