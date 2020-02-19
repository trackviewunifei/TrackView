import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSinglePageComparativeComponent } from './dash-single-page-comparative.component';

describe('DashSinglePageComparativeComponent', () => {
  let component: DashSinglePageComparativeComponent;
  let fixture: ComponentFixture<DashSinglePageComparativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSinglePageComparativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSinglePageComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
