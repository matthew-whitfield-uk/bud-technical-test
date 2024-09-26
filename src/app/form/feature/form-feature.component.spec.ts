import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFeatureComponent } from './form-feature.component';

describe('FormFeatureComponent', () => {
  let component: FormFeatureComponent;
  let fixture: ComponentFixture<FormFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFeatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
