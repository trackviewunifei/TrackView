import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFocalPointComponent } from './dash-focal-point.component';

describe('DashFocalPointComponent', () => {
  let component: DashFocalPointComponent;
  let fixture: ComponentFixture<DashFocalPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashFocalPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashFocalPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
