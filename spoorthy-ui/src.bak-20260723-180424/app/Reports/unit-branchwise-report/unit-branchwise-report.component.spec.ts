import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBranchwiseReportComponent } from './unit-branchwise-report.component';

describe('UnitBranchwiseReportComponent', () => {
  let component: UnitBranchwiseReportComponent;
  let fixture: ComponentFixture<UnitBranchwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitBranchwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBranchwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
