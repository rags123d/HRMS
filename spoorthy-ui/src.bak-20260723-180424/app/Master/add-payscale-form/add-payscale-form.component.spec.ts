import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayscaleFormComponent } from './add-payscale-form.component';

describe('AddPayscaleFormComponent', () => {
  let component: AddPayscaleFormComponent;
  let fixture: ComponentFixture<AddPayscaleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPayscaleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayscaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
