import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashComparativeComponent } from './dash-comparative.component';

describe('DashComparativeComponent', () => {
  let component: DashComparativeComponent;
  let fixture: ComponentFixture<DashComparativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashComparativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
