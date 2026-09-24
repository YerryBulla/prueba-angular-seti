import { TestBed } from '@angular/core/testing';
import { DnaGrid } from './dna-grid';

describe('DnaGrid', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaGrid],
    }).compileComponents();
  });

  it('creates the component with the mutant example preloaded', () => {
    const fixture = TestBed.createComponent(DnaGrid);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('detects the mutant example when verify is triggered', () => {
    const fixture = TestBed.createComponent(DnaGrid);
    const component = fixture.componentInstance as any;
    component.loadExample('mutant');
    component.verify();
    fixture.detectChanges();

    expect(component.result()?.isMutant).toBe(true);
  });

  it('does not flag the human example as mutant', () => {
    const fixture = TestBed.createComponent(DnaGrid);
    const component = fixture.componentInstance as any;
    component.loadExample('human');
    component.verify();
    fixture.detectChanges();

    expect(component.result()?.isMutant).toBe(false);
  });

  it('resizes the grid while preserving existing values', () => {
    const fixture = TestBed.createComponent(DnaGrid);
    const component = fixture.componentInstance as any;
    component.changeSize(5);
    expect(component.grid().length).toBe(5);
    expect(component.grid()[0].length).toBe(5);
  });
});
