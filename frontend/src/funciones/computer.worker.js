import { computerMove } from './computer.js';

self.onmessage = event => {
  const { board, difficulty } = event.data;
  self.postMessage(computerMove(board, difficulty));
};
