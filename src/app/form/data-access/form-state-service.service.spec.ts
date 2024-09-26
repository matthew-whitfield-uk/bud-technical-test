import { TestBed } from '@angular/core/testing';

import { FormStateServiceService } from './form-state-service.service';

describe('FormStateServiceService', () => {
  let service: FormStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
