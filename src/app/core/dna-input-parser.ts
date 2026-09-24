/** Parses a pasted DNA sample (JSON/JS array literal or newline/comma separated) into string rows. */

import { InvalidDnaError } from './mutant-detector';

export function parseDnaInput(raw: string): string[] {
  const bases = raw.match(/[ATCGatcg]+/g);

  if (!bases || bases.length === 0) {
    throw new InvalidDnaError('No se encontraron secuencias válidas (A, T, C, G) en el texto.');
  }

  const rows = bases.map((row) => row.toUpperCase());
  const size = rows.length;

  if (!rows.every((row) => row.length === size)) {
    throw new InvalidDnaError(
      `Se detectaron ${size} filas, pero no todas tienen ${size} caracteres. La matriz debe ser NxN.`,
    );
  }

  return rows;
}
