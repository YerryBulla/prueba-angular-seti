import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DnaMatch, InvalidDnaError } from '../../core/mutant-detector';
import { parseDnaInput } from '../../core/dna-input-parser';
import { MutantService } from '../../services/mutant.service';

type Base = 'A' | 'T' | 'C' | 'G';

const BASES: Base[] = ['A', 'T', 'C', 'G'];
const MIN_SIZE = 4;
const MAX_SIZE = 10;

const MUTANT_EXAMPLE = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
const HUMAN_EXAMPLE = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

@Component({
  selector: 'app-dna-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dna-grid.html',
  styleUrl: './dna-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnaGrid {
  protected readonly bases = BASES;
  protected readonly minSize = MIN_SIZE;
  protected readonly maxSize = MAX_SIZE;

  protected readonly size = signal(MUTANT_EXAMPLE.length);
  protected readonly grid = signal<Base[][]>(toGrid(MUTANT_EXAMPLE));
  protected readonly result = signal<{ isMutant: boolean; matches: DnaMatch[] } | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly pastedInput = signal('');
  protected readonly showPasteBox = signal(false);

  /** Map of "row,col" -> highlight classes, derived from the last analysis. */
  protected readonly highlights = computed(() => buildHighlightMap(this.result()?.matches ?? []));

  constructor(private readonly mutantService: MutantService) {}

  protected changeSize(newSize: number): void {
    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.floor(newSize) || MIN_SIZE));
    this.size.set(clamped);
    this.grid.update((current) => resizeGrid(current, clamped));
    this.clearResult();
  }

  protected updateCell(row: number, col: number, value: string): void {
    if (!isBase(value)) {
      return;
    }
    this.grid.update((current) => {
      const next = current.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
    this.clearResult();
  }

  protected loadExample(kind: 'mutant' | 'human'): void {
    const example = kind === 'mutant' ? MUTANT_EXAMPLE : HUMAN_EXAMPLE;
    this.size.set(example.length);
    this.grid.set(toGrid(example));
    this.clearResult();
  }

  protected togglePasteBox(): void {
    this.showPasteBox.update((value) => !value);
  }

  protected applyPastedInput(): void {
    try {
      const rows = parseDnaInput(this.pastedInput());
      this.size.set(rows.length);
      this.grid.set(toGrid(rows));
      this.clearResult();
      this.showPasteBox.set(false);
    } catch (error) {
      this.errorMessage.set(toErrorMessage(error));
    }
  }

  protected verify(): void {
    try {
      const dna = this.grid().map((row) => row.join(''));
      this.result.set(this.mutantService.analyze(dna));
      this.errorMessage.set(null);
    } catch (error) {
      this.result.set(null);
      this.errorMessage.set(toErrorMessage(error));
    }
  }

  protected cellClasses(row: number, col: number): string {
    return this.highlights().get(`${row},${col}`)?.join(' ') ?? '';
  }

  private clearResult(): void {
    this.result.set(null);
    this.errorMessage.set(null);
  }
}

function isBase(value: string): value is Base {
  return (BASES as string[]).includes(value);
}

function toGrid(rows: string[]): Base[][] {
  return rows.map((row) => row.split('') as Base[]);
}

function resizeGrid(current: Base[][], newSize: number): Base[][] {
  const next: Base[][] = [];
  for (let row = 0; row < newSize; row++) {
    const sourceRow = current[row] ?? [];
    const nextRow: Base[] = [];
    for (let col = 0; col < newSize; col++) {
      nextRow.push(sourceRow[col] ?? 'A');
    }
    next.push(nextRow);
  }
  return next;
}

function buildHighlightMap(matches: DnaMatch[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const match of matches) {
    const className = `hl-${match.direction}`;
    for (const { row, col } of match.positions) {
      const key = `${row},${col}`;
      const classes = map.get(key) ?? [];
      if (!classes.includes(className)) {
        classes.push(className);
      }
      map.set(key, classes);
    }
  }
  return map;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof InvalidDnaError) {
    return error.message;
  }
  return 'Ocurrió un error inesperado al analizar el ADN.';
}
