import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashGeneralComponent } from './dash-general.component';

describe('DashGeneralComponent', () => {
  let component: DashGeneralComponent;
  let fixture: ComponentFixture<DashGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
