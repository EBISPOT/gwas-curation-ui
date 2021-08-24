import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedTraitComponent } from './reported-trait.component';

describe('ReportedTraitComponent', () => {
  let component: ReportedTraitComponent;
  let fixture: ComponentFixture<ReportedTraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportedTraitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedTraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
