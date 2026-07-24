import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCandidatesComponent } from './bulk-candidates.component';

describe('BulkCandidatesComponent', () => {
  let component: BulkCandidatesComponent;
  let fixture: ComponentFixture<BulkCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
