import { useEffect, useRef, useState } from 'react';
import { createBoard, playMove } from './funciones/isWinner';
import confetti from 'canvas-confetti';
import './App.css';
import TvConnection from './component/TvConnection';
const names = { x: 'Coral', o: 'Ámbar' };
const fresh = () => ({ board: createBoard(), turn: 'x', result: null, line: [], moves: 0, last: null });
export default function App() {
  const [game, setGame] = useState(fresh);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [selected, setSelected] = useState(3);
  const [tv, setTv] = useState(false);
  const [notice, setNotice] = useState('');
  const [help, setHelp] = useState(false);
  const columns = useRef([]);
  const lock = useRef(false);
  useEffect(() => { lock.current = false; }, [game]);
  useEffect(() => {
    const change = () => { if (!document.fullscreenElement) setTv(false); };
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  function drop(col) {
    if (game.result || lock.current) return;
    const move = playMove(game.board, col, game.turn);
    if (!move) { setNotice('Columna llena. Elige otra.'); return; }
    lock.current = true;
    const result = move.line.length ? game.turn : move.draw ? 'draw' : null;
    setGame({ ...move, turn: result ? game.turn : game.turn === 'x' ? 'o' : 'x', result, moves: game.moves + 1, last: [move.row,col] });
    setNotice('');
    if (result) {
      setScores(old => ({ ...old, [result]: old[result] + 1 }));
      if (result !== 'draw') confetti({ particleCount: 90, spread: 65, disableForReducedMotion: true });
    }
  }
  function reset() { setGame(fresh()); setNotice(''); }
  async function toggleTv() {
    if (tv) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setTv(false); return;
    }
    setTv(true);
    try { await document.documentElement.requestFullscreen(); }
    catch { setNotice('Vista TV activada. Pantalla completa no disponible en este navegador.'); }
  }
  const status = game.result === 'draw' ? '¡Empate!' : game.result ? `¡${names[game.result]} gana!` : `Turno de ${names[game.turn]}`;
  return <main className={`app ${tv ? 'tv-mode' : ''}`}>
    <header className="topbar"><a className="brand" href="./"><span className="brand-mark">4</span> en raya<span className="accent">.</span></a><div className="header-actions"><button className="quiet" onClick={() => setHelp(!help)} aria-expanded={help}>Cómo jugar</button><button className="quiet" onClick={toggleTv}>{tv ? 'Salir de TV' : '▣ Vista TV'}</button></div></header>
    {help && <aside className="help"><strong>Una regla. Muchas posibilidades.</strong><p>Dos personas se turnan para dejar caer fichas. Conecta cuatro en horizontal, vertical o diagonal. Pulsa una columna, o usa Tab, las flechas y Enter.</p><p><strong>En tu TV:</strong> conecta el ordenador por HDMI o duplica la pantalla con la función de transmisión de tu dispositivo. Activa Vista TV para ampliar el tablero. Este botón no conecta por sí solo con el televisor.</p></aside>}
    <TvConnection />
    <section className="intro"><span className="eyebrow">EL CLÁSICO, SIEMPRE A MANO</span><h1>Una más<span className="accent">.</span></h1><p>Dos colores. Cuatro fichas. Tu próxima jugada.</p></section>
    <div className="play-layout"><aside className="scorecard"><span className="eyebrow">EL DUELO</span><h2>Buen juego.</h2><p className="muted">Comparte pantalla.<br/>Desafía a alguien cerca.</p>
      {['x','o'].map(player => <div key={player} className={`player-card ${!game.result && game.turn === player ? 'active' : ''}`}><span className={`token ${player}`}/><div><strong>{names[player]}</strong><small>{!game.result && game.turn === player ? 'Tu turno' : `Jugador ${player === 'x' ? 1 : 2}`}</small></div><b>{scores[player]}</b></div>)}
      <div className="draw-score">Empates <strong>{scores.draw}</strong></div><button className="text-button" onClick={() => { setScores({x:0,o:0,draw:0}); reset(); }}>Reiniciar marcador y partida</button>
    </aside><section className="arena" aria-label="Cuatro en raya"><div className="game-status" role="status"><span className={`token status-dot ${game.turn}`}/><strong>{status}</strong><span className="move-count">{game.moves} / 42</span></div>
      <div className={`board-wrap turn-${game.turn}`}><div className="column-controls">{Array.from({length:7},(_,col) => <button key={col} ref={el => { columns.current[col] = el; }} className={selected === col ? 'selected' : ''} aria-label={`Soltar ficha en columna ${col+1}`} disabled={Boolean(game.result) || game.board[0][col] !== 'W'} onFocus={() => setSelected(col)} onMouseEnter={() => setSelected(col)} onClick={() => drop(col)} onKeyDown={event => {
        if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); const step = event.key === 'ArrowLeft' ? -1 : 1; for (let i=1;i<=7;i++) { const next=(col+step*i+7)%7; if (!columns.current[next]?.disabled) { columns.current[next].focus(); break; } } }
      }}>↓</button>)}</div><div className="grid" aria-label="Tablero de seis filas y siete columnas">{game.board.flatMap((row,r) => row.map((cell,c) => <div key={`${r}-${c}`} className={`cell ${cell} ${game.line.some(([lr,lc]) => lr===r && lc===c) ? 'winning' : ''} ${game.last?.[0]===r && game.last?.[1]===c ? 'last' : ''}`}><span className="disc" role="img" aria-label={`Fila ${r+1}, columna ${c+1}: ${cell==='W' ? 'vacía' : names[cell]}`}/><button className="cell-hit" tabIndex={-1} aria-hidden="true" disabled={Boolean(game.result) || game.board[0][c] !== 'W'} onMouseEnter={() => setSelected(c)} onClick={() => drop(c)}/></div>))}</div></div>
      <div className="board-footer"><span>{game.result ? '¿La revancha?' : 'Conecta cuatro. En cualquier dirección.'}</span><button className="primary" onClick={reset}>{game.result ? 'Jugar otra vez ↗' : 'Nueva partida ↗'}</button></div><p className="notice" role="status">{notice}</p>
    </section></div><footer className="page-footer"><span>Un rato juntos. Una buena partida.</span><span>2 JUGADORES · SIN PRISAS</span></footer>
  </main>;
}
