# 🧬 Mutant Detector

Aplicacion Angular que determina si una secuencia de ADN pertenece a un mutante,
desarrollada como prueba tecnica.

Un humano es **mutante** si su ADN (una matriz NxN de bases `A`, `T`, `C`, `G`)
contiene **mas de una secuencia de 4 letras iguales consecutivas**, en sentido
horizontal, vertical u oblicuo (diagonal).

## Demo

La pantalla principal permite:

- Editar directamente una grilla NxN (selects por celda) para armar el ADN.
- Cambiar el tamano de la matriz (entre 4 y 10).
- Cargar los ejemplos de la prueba con un clic ("mutante" / "no-mutante").
- Pegar una secuencia en formato `["ATGCGA","CAGTGC",...]` o texto plano.
- Verificar el ADN y ver el resultado, con las secuencias encontradas
  **resaltadas por color** segun su direccion (igual que el material de referencia
  de la prueba): verde = diagonal, azul = vertical, rojo = horizontal.

## Algoritmo (isMutant)

La logica vive en `src/app/core/mutant-detector.ts` como una funcion pura, sin
dependencias de Angular, con la firma pedida:

```ts
isMutant(dna: string[]): boolean
```

Caracteristicas:

- **Complejidad O(N^2)**: recorre cada celda una unica vez y evalua las 4
  direcciones posibles (horizontal, vertical, diagonal derecha y diagonal
  izquierda) con trabajo constante por celda.
- **Corte temprano (short-circuit)**: apenas se detecta la segunda secuencia de
  4 bases iguales, la funcion retorna `true` de inmediato sin seguir
  escaneando el resto de la matriz.
- **Validacion de entrada**: lanza `InvalidDnaError` si el ADN no es una matriz
  NxN o contiene caracteres distintos de A, T, C, G.

Para la UI existe ademas `findDnaMatches(dna)`, que recorre toda la matriz (sin
corte temprano) para poder resaltar todas las coincidencias encontradas.

## Estructura del proyecto

```
src/app/
|-- core/
|   |-- mutant-detector.ts        # isMutant, findDnaMatches, validacion (logica pura)
|   |-- mutant-detector.spec.ts
|   |-- dna-input-parser.ts       # Parseo de texto pegado a arreglo de ADN
|   `-- dna-input-parser.spec.ts
|-- services/
|   |-- mutant.service.ts         # Wrapper Angular (Injectable) sobre la logica pura
|   `-- mutant.service.spec.ts
|-- components/dna-grid/
|   |-- dna-grid.ts               # Componente standalone con la pantalla principal
|   |-- dna-grid.html
|   |-- dna-grid.scss
|   `-- dna-grid.spec.ts
`-- app.ts / app.html             # Shell de la aplicacion
```

## Requisitos

- Node.js 20+
- Angular CLI 22 (se puede usar via npx sin instalacion global)

## Como correrlo

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm start
```

Abrir `http://localhost:4200/` en el navegador.

## Tests

El proyecto usa Vitest (test runner por defecto de Angular CLI 22):

```bash
npm test
```

Incluye pruebas unitarias para:

- El algoritmo `isMutant` (caso mutante, no-mutante, bordes, errores de validacion).
- `findDnaMatches` (deteccion y ubicacion de secuencias).
- El parser de texto pegado.
- El servicio Angular `MutantService`.
- El componente `DnaGrid` (carga de ejemplos, verificacion, resize de grilla).

## Build de produccion

```bash
npm run build
```

Los artefactos quedan en `dist/mutant-detector`.

## Ejemplo de la prueba

```ts
const dna = ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"];
// isMutant(dna) === true
```