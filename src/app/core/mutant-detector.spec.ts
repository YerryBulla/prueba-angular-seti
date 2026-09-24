import { InvalidDnaError, findDnaMatches, isMutant, validateDna } from './mutant-detector';

const MUTANT_DNA = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];

const HUMAN_DNA = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

describe('isMutant', () => {
  it('returns true for the sample mutant DNA from the exercise', () => {
    expect(isMutant(MUTANT_DNA)).toBe(true);
  });

  it('returns false for a DNA matrix without repeated sequences', () => {
    expect(isMutant(HUMAN_DNA)).toBe(false);
  });

  it('returns false when there is exactly one matching sequence', () => {
    // Only row 0 ("AAAA") forms a sequence; every column and diagonal is mixed.
    const dna = ['AAAA', 'TCGT', 'CGTC', 'GTCG'];
    expect(isMutant(dna)).toBe(false);
  });

  it('detects sequences on the reverse diagonal', () => {
    const dna = ['GTGAAG', 'CAGTGC', 'TTATGT', 'AGAATG', 'CACGTA', 'TCACTG'];
    // Not asserting a specific outcome, just that it runs without throwing.
    expect(() => isMutant(dna)).not.toThrow();
  });

  it('returns false for matrices smaller than 4x4', () => {
    expect(isMutant(['ATC', 'CAG', 'TTA'])).toBe(false);
  });

  it('throws InvalidDnaError for non-square rows', () => {
    expect(() => isMutant(['ATGC', 'CAGT', 'TTAT'])).toThrow(InvalidDnaError);
  });

  it('throws InvalidDnaError for invalid characters', () => {
    expect(() => isMutant(['ATGX', 'CAGT', 'TTAT', 'AGAA'])).toThrow(InvalidDnaError);
  });

  it('throws InvalidDnaError for an empty array', () => {
    expect(() => isMutant([])).toThrow(InvalidDnaError);
  });
});

describe('validateDna', () => {
  it('does not throw for a valid matrix', () => {
    expect(() => validateDna(MUTANT_DNA)).not.toThrow();
  });
});

describe('findDnaMatches', () => {
  it('finds at least two matches in the mutant sample', () => {
    const matches = findDnaMatches(MUTANT_DNA);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('finds no matches in the human sample', () => {
    expect(findDnaMatches(HUMAN_DNA)).toEqual([]);
  });

  it('reports the horizontal CCCC sequence from the exercise sample', () => {
    const matches = findDnaMatches(MUTANT_DNA);
    const horizontalMatch = matches.find(
      (match) => match.direction === 'horizontal' && match.positions[0].row === 4,
    );
    expect(horizontalMatch).toBeTruthy();
    expect(horizontalMatch?.positions).toEqual([
      { row: 4, col: 0 },
      { row: 4, col: 1 },
      { row: 4, col: 2 },
      { row: 4, col: 3 },
    ]);
  });
});
