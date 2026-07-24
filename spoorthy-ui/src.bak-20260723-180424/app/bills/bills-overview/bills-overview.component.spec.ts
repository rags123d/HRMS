import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsOverviewComponent } from './bills-overview.component';

describe('BillsOverviewComponent', () => {
  let component: BillsOverviewComponent;
  let fixture: ComponentFixture<BillsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
