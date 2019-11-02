import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFatecoins2Component } from './dashboard-fatecoins2.component';

describe('DashboardFatecoins2Component', () => {
  let component: DashboardFatecoins2Component;
  let fixture: ComponentFixture<DashboardFatecoins2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFatecoins2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFatecoins2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
