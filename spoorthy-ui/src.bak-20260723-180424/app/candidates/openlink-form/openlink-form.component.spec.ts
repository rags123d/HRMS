import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenlinkFormComponent } from './openlink-form.component';

describe('OpenlinkFormComponent', () => {
  let component: OpenlinkFormComponent;
  let fixture: ComponentFixture<OpenlinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenlinkFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenlinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
