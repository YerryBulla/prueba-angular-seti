/** Pure, framework-agnostic mutant DNA detection logic. */

export class InvalidDnaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDnaError';
  }
}

export type MatchDirection = 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';

export interface DnaMatch {
  direction: MatchDirection;
  positions: Array<{ row: number; col: number }>;
}

const SEQUENCE_LENGTH = 4;
const MIN_SEQUENCES_TO_BE_MUTANT = 2;
const VALID_BASES = /^[ATCG]+$/;

/** Direction vectors covering the 4 non-redundant axes of a grid (the other 4 are mirror images). */
const DIRECTIONS: Array<{ dRow: number; dCol: number; direction: MatchDirection }> = [
  { dRow: 0, dCol: 1, direction: 'horizontal' },
  { dRow: 1, dCol: 0, direction: 'vertical' },
  { dRow: 1, dCol: 1, direction: 'diagonal-right' },
  { dRow: 1, dCol: -1, direction: 'diagonal-left' },
];

/** Throws InvalidDnaError if `dna` isn't a well-formed NxN matrix of A/T/C/G characters. */
export function validateDna(dna: string[]): void {
  if (!Array.isArray(dna) || dna.length === 0) {
    throw new InvalidDnaError('El ADN debe ser un arreglo no vacío de cadenas.');
  }

  const size = dna.length;
  for (const row of dna) {
    if (typeof row !== 'string' || row.length !== size || !VALID_BASES.test(row)) {
      throw new InvalidDnaError(
        `Cada fila debe tener ${size} caracteres usando solo las bases A, T, C, G.`,
      );
    }
  }
}

/**
 * Determines whether the given NxN DNA matrix belongs to a mutant.
 * A human is mutant if it has more than one sequence of 4 equal consecutive
 * bases, found horizontally, vertically or diagonally.
 *
 * Runs in O(N^2) with a constant amount of work per cell, and returns as soon
 * as a second sequence is found instead of scanning the whole matrix.
 */
export function isMutant(dna: string[]): boolean {
  validateDna(dna);

  const size = dna.length;
  if (size < SEQUENCE_LENGTH) {
    return false;
  }

  let sequencesFound = 0;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const base = dna[row][col];

      for (const { dRow, dCol } of DIRECTIONS) {
        const endRow = row + dRow * (SEQUENCE_LENGTH - 1);
        const endCol = col + dCol * (SEQUENCE_LENGTH - 1);
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
          continue;
        }

        if (
          dna[row + dRow][col + dCol] === base &&
          dna[row + dRow * 2][col + dCol * 2] === base &&
          dna[endRow][endCol] === base
        ) {
          sequencesFound++;
          if (sequencesFound >= MIN_SEQUENCES_TO_BE_MUTANT) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Finds every sequence of 4 equal consecutive bases in the DNA matrix.
 * Unlike `isMutant`, this scans the whole matrix (no early exit) so the UI
 * can highlight all matches, not just the two needed to prove mutation.
 */
export function findDnaMatches(dna: string[]): DnaMatch[] {
  validateDna(dna);

  const size = dna.length;
  const matches: DnaMatch[] = [];
  if (size < SEQUENCE_LENGTH) {
    return matches;
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const base = dna[row][col];

      for (const { dRow, dCol, direction } of DIRECTIONS) {
        const endRow = row + dRow * (SEQUENCE_LENGTH - 1);
        const endCol = col + dCol * (SEQUENCE_LENGTH - 1);
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
          continue;
        }

        const positions = [{ row, col }];
        let matched = true;
        for (let step = 1; step < SEQUENCE_LENGTH; step++) {
          const r = row + dRow * step;
          const c = col + dCol * step;
          if (dna[r][c] !== base) {
            matched = false;
            break;
          }
          positions.push({ row: r, col: c });
        }

        if (matched) {
          matches.push({ direction, positions });
        }
      }
    }
  }

  return matches;
}
