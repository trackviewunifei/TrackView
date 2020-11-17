import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashEstruturaPaginasComponent } from './dash-estrutura-paginas.component';

describe('DashEstruturaPaginasComponent', () => {
  let component: DashEstruturaPaginasComponent;
  let fixture: ComponentFixture<DashEstruturaPaginasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashEstruturaPaginasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashEstruturaPaginasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
