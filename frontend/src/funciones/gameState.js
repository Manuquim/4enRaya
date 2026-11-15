import { createBoard, playMove } from './isWinner.js';

export const freshGame = (starter = 'x') => ({ board: createBoard(), turn: starter === 'o' ? 'o' : 'x', result: null, line: [], moves: 0, last: null });

export function advanceGame(game, col, mode = 'two', actor = 'human') {
  if (game.result) return game;
  const computerTurn = mode === 'single' && game.turn === 'o';
  if ((actor === 'computer') !== computerTurn) return game;
  const move = playMove(game.board, col, game.turn);
  if (!move) return game;
  const result = move.line.length ? game.turn : move.draw ? 'draw' : null;
  return {
    board: move.board, line: move.line, last: [move.row, col],
    result, moves: game.moves + 1,
    turn: result ? game.turn : game.turn === 'x' ? 'o' : 'x',
  };
}
