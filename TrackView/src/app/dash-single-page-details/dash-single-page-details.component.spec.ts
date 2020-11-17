import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSinglePageDetailsComponent } from './dash-single-page-details.component';

describe('DashSinglePageDetailsComponent', () => {
  let component: DashSinglePageDetailsComponent;
  let fixture: ComponentFixture<DashSinglePageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSinglePageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSinglePageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
