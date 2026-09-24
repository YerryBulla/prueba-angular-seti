import { parseDnaInput } from './dna-input-parser';
import { InvalidDnaError } from './mutant-detector';

describe('parseDnaInput', () => {
  it('parses a JSON array literal', () => {
    const raw = '["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]';
    expect(parseDnaInput(raw)).toEqual([
      'ATGCGA',
      'CAGTGC',
      'TTATGT',
      'AGAAGG',
      'CCCCTA',
      'TCACTG',
    ]);
  });

  it('parses newline separated rows and normalizes casing', () => {
    const raw = 'atgcga\ncagtgc\nttatgt\nagaagg\nccccta\ntcactg';
    expect(parseDnaInput(raw)).toEqual([
      'ATGCGA',
      'CAGTGC',
      'TTATGT',
      'AGAAGG',
      'CCCCTA',
      'TCACTG',
    ]);
  });

  it('throws when rows are not square', () => {
    expect(() => parseDnaInput('ATGC\nCAGT\nTTAT')).toThrow(InvalidDnaError);
  });

  it('throws when no valid bases are found', () => {
    expect(() => parseDnaInput('hello world 123')).toThrow(InvalidDnaError);
  });
});
