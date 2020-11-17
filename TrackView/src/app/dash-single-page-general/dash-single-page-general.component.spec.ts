import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSinglePageGeneralComponent } from './dash-single-page-general.component';

describe('DashSinglePageGeneralComponent', () => {
  let component: DashSinglePageGeneralComponent;
  let fixture: ComponentFixture<DashSinglePageGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSinglePageGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSinglePageGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
