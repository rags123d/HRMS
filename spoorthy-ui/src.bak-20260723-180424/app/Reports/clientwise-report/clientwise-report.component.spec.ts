import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientwiseReportComponent } from './clientwise-report.component';

describe('ClientwiseReportComponent', () => {
  let component: ClientwiseReportComponent;
  let fixture: ComponentFixture<ClientwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
