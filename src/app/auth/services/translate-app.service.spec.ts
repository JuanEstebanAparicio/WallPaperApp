import { TestBed } from '@angular/core/testing';

import { TranslateAppService } from './translate-app.service';

describe('TranslateAppService', () => {
  let service: TranslateAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
