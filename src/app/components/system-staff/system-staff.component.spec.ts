import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemStaffComponent } from './system-staff.component';

describe('SystemStaffComponent', () => {
  let component: SystemStaffComponent;
  let fixture: ComponentFixture<SystemStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
