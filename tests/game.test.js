import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBoard, playMove, winningLine, tablas } from '../src/funciones/isWinner.js';
test('gravity, immutable rows, full-column and invalid-column rejection', () => {
  const original = createBoard();
  let board = original;
  for (let i = 0; i < 6; i++) {
    const move = playMove(board, 3, i % 2 ? 'o' : 'x');
    assert.equal(move.row, 5 - i); board = move.board;
  }
  assert.equal(original[5][3], 'W');
  assert.equal(playMove(board, 3, 'x'), null);
  for (const col of [-1, 7, NaN, 1.5]) assert.equal(playMove(board, col, 'x'), null);
});
test('wins with the last piece anywhere in all four directions', () => {
  for (const [dr, dc, startR, startC] of [[0,1,5,0],[1,0,1,3],[1,1,1,1],[1,-1,1,5]]) {
    for (let last = 0; last < 4; last++) {
      const board = createBoard();
      for (let i = 0; i < 4; i++) board[startR+i*dr][startC+i*dc] = 'x';
      assert.equal(winningLine(board, startR+last*dr, startC+last*dc).length, 4);
    }
  }
});
test('empty cells, gaps, and opposing pieces are not wins', () => {
  const board = createBoard();
  assert.deepEqual(winningLine(board,5,0), []);
  board[5] = ['x','x','o','x','W','x','x'];
  assert.deepEqual(winningLine(board,5,1), []);
  assert.equal(tablas(board), false);
});
test('full board without four in a row is a draw', () => {
  const board = Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (c + Math.floor(r / 2)) % 2 ? 'x' : 'o'));
  assert.equal(tablas(board), true);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) assert.deepEqual(winningLine(board,r,c), []);
});
