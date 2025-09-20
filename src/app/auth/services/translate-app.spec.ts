import { TestBed } from '@angular/core/testing';

import { TranslateApp } from './translate-app';

describe('TranslateApp', () => {
  let service: TranslateApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateApp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
