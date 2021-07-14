import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDetailsTabComponent } from './submission-details-tab.component';

describe('SubmissionDetailsTabComponent', () => {
  let component: SubmissionDetailsTabComponent;
  let fixture: ComponentFixture<SubmissionDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
