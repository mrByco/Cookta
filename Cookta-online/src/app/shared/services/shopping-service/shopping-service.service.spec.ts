import { TestBed } from '@angular/core/testing';

import { ShoppingService } from './shopping.service';
import {ServerService} from "../server.service";

describe('ShoppingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
        {provide: ServerService, useValue: {}}
        ]
  }));

  it('should be created', () => {
    const service: ShoppingService = TestBed.get(ShoppingService);
    expect(service).toBeTruthy();
  });
});
