import { playMove, winningLine } from './isWinner.js';

const ORDER = [3, 2, 4, 1, 5, 0, 6];
const WINDOWS = [];
for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
  for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    if (r + dr * 3 < 6 && c + dc * 3 >= 0 && c + dc * 3 < 7) {
      WINDOWS.push(Array.from({ length: 4 }, (_, i) => [r + dr * i, c + dc * i]));
    }
  }
}

function evaluate(board) {
  let score = 0;
  for (const row of board) score += row[3] === 'o' ? 5 : row[3] === 'x' ? -5 : 0;
  for (const window of WINDOWS) {
    let own = 0, opponent = 0;
    for (const [r, c] of window) {
      if (board[r][c] === 'o') own++;
      if (board[r][c] === 'x') opponent++;
    }
    if (!opponent) score += [0, 1, 12, 100, 100000][own];
    if (!own) score -= [0, 1, 14, 120, 100000][opponent];
  }
  return score;
}

// Local minimax with alpha-beta pruning. All moves use copies of the board.
export function computerMove(board, difficulty = 'normal') {
  const legal = ORDER.filter(col => board[0][col] === 'W');
  if (!legal.length) return null;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
    if (board[r][c] !== 'W' && winningLine(board, r, c).length) return null;
  }
  const win = legal.find(col => playMove(board, col, 'o').line.length);
  if (win !== undefined) return win;
  const block = legal.find(col => playMove(board, col, 'x').line.length);
  if (block !== undefined) return block;

  // A level is one individual move, starting with the AI's candidate move.
  const depth = { easy: 2, normal: 3, hard: 4 }[difficulty] ?? 3;
  function search(position, remaining, player, alpha, beta) {
    const columns = ORDER.filter(col => position[0][col] === 'W');
    if (!columns.length) return 0;
    if (!remaining) return evaluate(position);
    let best = player === 'o' ? -Infinity : Infinity;
    for (const col of columns) {
      const move = playMove(position, col, player);
      const score = move.line.length ? (player === 'o' ? 100000 + remaining : -100000 - remaining)
        : move.draw ? 0 : search(move.board, remaining - 1, player === 'o' ? 'x' : 'o', alpha, beta);
      if (player === 'o') { best = Math.max(best, score); alpha = Math.max(alpha, best); }
      else { best = Math.min(best, score); beta = Math.min(beta, best); }
      if (alpha >= beta) break;
    }
    return best;
  }

  let choice = legal[0], best = -Infinity;
  for (const col of legal) {
    const move = playMove(board, col, 'o');
    const score = move.draw ? 0 : search(move.board, depth - 1, 'x', best, Infinity);
    if (score > best) { best = score; choice = col; }
  }
  return choice;
}
