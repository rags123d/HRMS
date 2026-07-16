import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobroleDetailsComponent } from './jobrole-details.component';

describe('JobroleDetailsComponent', () => {
  let component: JobroleDetailsComponent;
  let fixture: ComponentFixture<JobroleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobroleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobroleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
