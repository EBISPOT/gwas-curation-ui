import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteratureTabComponent } from './literature-tab.component';

describe('LiteratureTabComponent', () => {
  let component: LiteratureTabComponent;
  let fixture: ComponentFixture<LiteratureTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiteratureTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteratureTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
