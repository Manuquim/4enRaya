import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBoard, playMove } from '../frontend/src/funciones/isWinner.js';
import { computerMove } from '../frontend/src/funciones/computer.js';
import { freshGame, advanceGame } from '../frontend/src/funciones/gameState.js';

test('AI takes a win before blocking an opponent', () => {
  const board = createBoard();
  board[5] = ['o', 'o', 'o', 'W', 'x', 'x', 'x'];
  for (const level of ['easy', 'normal', 'hard']) assert.equal(computerMove(board, level), 3);
});

test('normal and hard AI block horizontal and vertical wins', () => {
  const horizontal = createBoard();
  horizontal[5] = ['x', 'x', 'W', 'x', 'o', 'W', 'o'];
  const vertical = createBoard();
  for (let r = 3; r < 6; r++) vertical[r][6] = 'x';
  for (const level of ['normal', 'hard']) {
    assert.equal(computerMove(horizontal, level), 2);
    assert.equal(computerMove(vertical, level), 6);
  }
});

test('AI recognizes diagonal opportunities and threats', () => {
  for (const player of ['x', 'o']) {
    const board = createBoard();
    board[5] = [player, 'o', 'x', 'o', 'W', 'W', 'W'];
    board[4][1] = player; board[4][2] = 'o'; board[4][3] = 'x';
    board[3][2] = player; board[3][3] = 'o';
    assert.equal(computerMove(board, 'hard'), 3);
  }
});

test('AI plays the only free column without modifying the board', () => {
  const board = Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (c + Math.floor(r / 2)) % 2 ? 'x' : 'o'));
  assert.equal(computerMove(board), null);
  board[0][2] = 'W';
  const original = structuredClone(board);
  for (const level of ['easy', 'normal', 'hard']) assert.equal(computerMove(board, level, () => 0.5), 2);
  assert.deepEqual(board, original);
});

test('AI does not play an already won game and prefers the center on an empty board', () => {
  const board = createBoard();
  assert.equal(computerMove(board, 'hard'), 3);
  board[5] = ['x', 'x', 'x', 'x', 'W', 'W', 'W'];
  assert.equal(computerMove(board), null);
});

test('solo game rejects human moves during the AI turn and AI moves during the human turn', () => {
  const initial = freshGame();
  assert.equal(advanceGame(initial, 0, 'single', 'computer'), initial);
  const human = advanceGame(initial, 3, 'single');
  assert.equal(human.turn, 'o');
  assert.equal(advanceGame(human, 4, 'single'), human);
  const computer = advanceGame(human, 2, 'single', 'computer');
  assert.equal(computer.turn, 'x');
  assert.equal(computer.moves, 2);
  assert.equal(computer.board[5][3], 'x');
  assert.equal(computer.board[5][2], 'o');
  assert.equal(initial.moves, 0);
});

test('two local players can still alternate and terminal games reject all further moves', () => {
  let game = freshGame();
  for (const col of [0, 1, 0, 1, 0, 1, 0]) game = advanceGame(game, col, 'two');
  assert.equal(game.result, 'x');
  assert.equal(game.moves, 7);
  assert.equal(advanceGame(game, 2, 'two'), game);
  assert.equal(advanceGame(game, 2, 'single', 'computer'), game);
});

test('the AI winning board stays frozen until an explicit new game', () => {
  let game = freshGame();
  for (let i = 0; i < 3; i++) {
    game = advanceGame(game, 0, 'single');
    game = advanceGame(game, 1, 'single', 'computer');
  }
  game = advanceGame(game, 2, 'single');
  game = advanceGame(game, 1, 'single', 'computer');
  assert.equal(game.result, 'o');
  assert.equal(game.line.length, 4);
  const finalBoard = structuredClone(game);
  assert.equal(computerMove(game.board, 'hard'), null);
  for (let col = 0; col < 7; col++) {
    assert.equal(advanceGame(game, col, 'single'), game);
    assert.equal(advanceGame(game, col, 'single', 'computer'), game);
  }
  assert.deepEqual(game, finalBoard);
  const next = freshGame();
  assert.equal(next.result, null);
  assert.equal(next.moves, 0);
  assert.ok(next.board.flat().every(cell => cell === 'W'));
});

test('normal AI avoids a move which gives the opponent an immediate win', () => {
  const board = createBoard();
  board[5] = ['o', 'x', 'x', 'W', 'W', 'W', 'W'];
  board[4][0] = 'x'; board[4][1] = 'x'; board[4][2] = 'x';
  const col = computerMove(board, 'normal');
  assert.notEqual(col, 3);
  const move = playMove(board, col, 'o');
  assert.ok(move);
});

test('a complete solo game ends within 42 moves, without overwriting any piece', () => {
  let game = freshGame();
  while (!game.result) {
    const before = game;
    const col = game.turn === 'o' ? computerMove(game.board) : game.board[0].findIndex(cell => cell === 'W');
    game = advanceGame(game, col, 'single', game.turn === 'o' ? 'computer' : 'human');
    assert.equal(game.moves, before.moves + 1);
    assert.ok(game.moves <= 42);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
      if (before.board[r][c] !== 'W') assert.equal(game.board[r][c], before.board[r][c]);
    }
  }
  assert.ok(['x', 'o', 'draw'].includes(game.result));
});
