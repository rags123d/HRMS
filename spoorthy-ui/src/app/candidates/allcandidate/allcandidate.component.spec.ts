import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcandidateComponent } from './allcandidate.component';

describe('AllcandidateComponent', () => {
  let component: AllcandidateComponent;
  let fixture: ComponentFixture<AllcandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllcandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
