import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionEditTabComponent } from './submission-edit-tab.component';

describe('SubmissionEditTabComponent', () => {
  let component: SubmissionEditTabComponent;
  let fixture: ComponentFixture<SubmissionEditTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionEditTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionEditTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
