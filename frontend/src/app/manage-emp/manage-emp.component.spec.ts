import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmpComponent } from './manage-emp.component';

describe('ManageEmpComponent', () => {
  let component: ManageEmpComponent;
  let fixture: ComponentFixture<ManageEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
