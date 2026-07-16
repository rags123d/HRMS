import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedcandidatesComponent } from './rejectedcandidates.component';

describe('RejectedcandidatesComponent', () => {
  let component: RejectedcandidatesComponent;
  let fixture: ComponentFixture<RejectedcandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedcandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedcandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
