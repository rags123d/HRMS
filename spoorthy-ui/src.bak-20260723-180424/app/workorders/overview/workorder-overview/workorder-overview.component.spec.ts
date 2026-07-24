import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderOverviewComponent } from './workorder-overview.component';

describe('WorkorderOverviewComponent', () => {
  let component: WorkorderOverviewComponent;
  let fixture: ComponentFixture<WorkorderOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
