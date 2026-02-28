//Funcion para encontrar combinacion ganadora y ganador si hay
const DIRECCIONES = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1]
];

const contarFichas = (tablero, fila, col, deltaFila, deltaCol, ficha) => {
  let total = 0;
  let nuevaFila = fila + deltaFila;
  let nuevaCol = col + deltaCol;

  while (
    nuevaFila >= 0 && nuevaFila < 6 &&
    nuevaCol >= 0 && nuevaCol < 7 &&
    tablero[nuevaFila][nuevaCol] === ficha
  ) {
    total += 1;
    nuevaFila += deltaFila;
    nuevaCol += deltaCol;
  }

  return total;
};

export const isWinner = (tablero, fila, col) => {
  const ficha = tablero[fila][col];

  if (ficha !== 'x' && ficha !== 'o') {
    return '0';
  }

  for (const [deltaFila, deltaCol] of DIRECCIONES) {
    const consecutivas = 1 +
      contarFichas(tablero, fila, col, deltaFila, deltaCol, ficha) +
      contarFichas(tablero, fila, col, -deltaFila, -deltaCol, ficha);

    if (consecutivas >= 4) {
      return ficha;
    }
  }

  return '0';
};

export const tablas = (x) => {
  let tablas = true;
  for (let i = 0; i < 7; i++) {
    if (x[0][i] === 'W') tablas = false;
  }

  return tablas;
};
