import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayScaleDataComponent } from './pay-scale-data.component';

describe('PayScaleDataComponent', () => {
  let component: PayScaleDataComponent;
  let fixture: ComponentFixture<PayScaleDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayScaleDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayScaleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
