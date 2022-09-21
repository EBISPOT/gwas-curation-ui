import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationTabComponent } from './association-tab.component';

describe('AssociationTabComponent', () => {
  let component: AssociationTabComponent;
  let fixture: ComponentFixture<AssociationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
