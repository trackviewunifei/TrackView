import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashClientesEventosComponent } from './dash-clientes-eventos.component';

describe('DashClientesEventosComponent', () => {
  let component: DashClientesEventosComponent;
  let fixture: ComponentFixture<DashClientesEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashClientesEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashClientesEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
