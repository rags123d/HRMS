import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFormatComponent } from './bill-format.component';

describe('BillFormatComponent', () => {
  let component: BillFormatComponent;
  let fixture: ComponentFixture<BillFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
