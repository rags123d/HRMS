import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderwiseReportComponent } from './workorderwise-report.component';

describe('WorkorderwiseReportComponent', () => {
  let component: WorkorderwiseReportComponent;
  let fixture: ComponentFixture<WorkorderwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
