import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationhwiseReportComponent } from './designationhwise-report.component';

describe('DesignationhwiseReportComponent', () => {
  let component: DesignationhwiseReportComponent;
  let fixture: ComponentFixture<DesignationhwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationhwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationhwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
