import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFatecoins4Component } from './dashboard-fatecoins4.component';

describe('DashboardFatecoins4Component', () => {
  let component: DashboardFatecoins4Component;
  let fixture: ComponentFixture<DashboardFatecoins4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFatecoins4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFatecoins4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
