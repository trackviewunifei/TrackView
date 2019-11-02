import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFatecoins3Component } from './dashboard-fatecoins3.component';

describe('DashboardFatecoins3Component', () => {
  let component: DashboardFatecoins3Component;
  let fixture: ComponentFixture<DashboardFatecoins3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFatecoins3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFatecoins3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
