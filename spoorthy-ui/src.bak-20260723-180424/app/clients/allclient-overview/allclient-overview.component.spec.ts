import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClientOverviewComponent } from './allclient-overview.component';

describe('ClientOverviewComponent', () => {
  let component: AllClientOverviewComponent;
  let fixture: ComponentFixture<AllClientOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllClientOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllClientOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
