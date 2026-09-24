import { Injectable } from '@angular/core';
import { DnaMatch, findDnaMatches, isMutant } from '../core/mutant-detector';

export interface MutantAnalysis {
  isMutant: boolean;
  matches: DnaMatch[];
}

@Injectable({ providedIn: 'root' })
export class MutantService {
  /** Signature required by the exercise: isMutant(dna: string[]): boolean */
  isMutant(dna: string[]): boolean {
    return isMutant(dna);
  }

  /** Runs isMutant plus a full scan so the UI can highlight every match found. */
  analyze(dna: string[]): MutantAnalysis {
    return {
      isMutant: isMutant(dna),
      matches: findDnaMatches(dna),
    };
  }
}
