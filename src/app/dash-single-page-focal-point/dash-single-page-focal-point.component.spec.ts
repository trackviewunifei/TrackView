import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSinglePageFocalPointComponent } from './dash-single-page-focal-point.component';

describe('DashSinglePageFocalPointComponent', () => {
  let component: DashSinglePageFocalPointComponent;
  let fixture: ComponentFixture<DashSinglePageFocalPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSinglePageFocalPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSinglePageFocalPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
