import { TestBed } from '@angular/core/testing';
import { MutantService } from './mutant.service';

describe('MutantService', () => {
  let service: MutantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MutantService);
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('detects the mutant sample DNA', () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    expect(service.isMutant(dna)).toBe(true);
  });

  it('returns matches alongside the isMutant flag', () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    const result = service.analyze(dna);
    expect(result.isMutant).toBe(true);
    expect(result.matches.length).toBeGreaterThan(0);
  });
});
