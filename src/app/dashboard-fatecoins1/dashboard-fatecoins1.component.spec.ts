import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFatecoins1Component } from './dashboard-fatecoins1.component';

describe('DashboardFatecoins1Component', () => {
  let component: DashboardFatecoins1Component;
  let fixture: ComponentFixture<DashboardFatecoins1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFatecoins1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFatecoins1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
