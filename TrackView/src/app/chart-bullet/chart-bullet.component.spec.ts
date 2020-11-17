import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBulletComponent } from './chart-bullet.component';

describe('ChartBulletComponent', () => {
  let component: ChartBulletComponent;
  let fixture: ComponentFixture<ChartBulletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBulletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBulletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
