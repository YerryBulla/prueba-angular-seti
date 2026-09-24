import { Component } from '@angular/core';
import { DnaGrid } from './components/dna-grid/dna-grid';

@Component({
  imports: [DnaGrid],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
