import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDetailsComponent } from './dash-details.component';

describe('DashDetailsComponent', () => {
  let component: DashDetailsComponent;
  let fixture: ComponentFixture<DashDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
