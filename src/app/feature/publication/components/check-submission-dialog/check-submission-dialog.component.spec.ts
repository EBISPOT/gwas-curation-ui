import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSubmissionDialogComponent } from './check-submission-dialog.component';

describe('CheckSubmissionDialogComponent', () => {
  let component: CheckSubmissionDialogComponent;
  let fixture: ComponentFixture<CheckSubmissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckSubmissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
