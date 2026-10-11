export const createBoard = () => Array.from({ length: 6 }, () => Array(7).fill('W'));
export function winningLine(board, row, col) {
  const player = board[row]?.[col];
  if (!player || player === 'W') return [];
  for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
    const line = [[row,col]];
    for (const sign of [-1,1]) {
      let r = row + dr * sign, c = col + dc * sign;
      while (board[r]?.[c] === player) { line.push([r,c]); r += dr * sign; c += dc * sign; }
    }
    if (line.length >= 4) return line;
  }
  return [];
}
export const isWinner = (board,row,col) => winningLine(board,row,col).length ? board[row][col] : '0';
export const tablas = board => board[0].every(cell => cell !== 'W');
export function playMove(board,col,player) {
  if (!Number.isInteger(col) || col < 0 || col > 6 || board[0][col] !== 'W') return null;
  const row = board.findLastIndex(cells => cells[col] === 'W');
  const next = board.map(cells => [...cells]); next[row][col] = player;
  return { board: next, row, col, line: winningLine(next,row,col), draw: tablas(next) };
}
