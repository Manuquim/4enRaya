import { useEffect, useRef, useState } from 'react';
import { createBoard, playMove } from './funciones/isWinner';
import confetti from 'canvas-confetti';
import './App.css';
import TvConnection from './component/TvConnection';
import HowToPlay from './component/HowToPlay';
const names = { x: 'Coral', o: 'Ámbar' };
const fresh = () => ({ board: createBoard(), turn: 'x', result: null, line: [], moves: 0, last: null });
export default function App() {
  const [game, setGame] = useState(fresh);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [selected, setSelected] = useState(3);
  const [tv, setTv] = useState(false);
  const [notice, setNotice] = useState('');
  const [help, setHelp] = useState(false);
  const [menu, setMenu] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState('cast');
  const disconnectDialog = useRef(null);
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
  function confirmTv(method) {
    setConnectionMethod(method);
    setConnected(true);
    setConnectionOpen(false);
    setMenu(false);
    setHelp(false);
    setNotice('');
  }
  async function disconnectTv() {
    disconnectDialog.current.close();
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
    setConnected(false);
    setTv(false);
    setNotice('');
  }
  const status = game.result === 'draw' ? '¡Empate!' : game.result ? `¡${names[game.result]} gana!` : `Turno de ${names[game.turn]}`;
  const isTv = tv || connected;
  const turnDisplay = <div className="game-status" role="status"><span className={`token status-dot ${game.turn}`}/><strong>{status}</strong><span className="move-count">{game.moves} / 42</span></div>;
  const newRoundButton = <button className="primary" onClick={reset}>{game.result ? 'Jugar otra vez ↗' : 'Nueva partida ↗'}</button>;
  return <main className={`app ${tv || connected ? 'tv-mode' : ''}`}>
    {!(tv || connected) && <header className="topbar"><a className="brand" href="./"><span className="brand-mark">4</span> en raya<span className="accent">.</span></a><div className="header-actions"><button className="quiet" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="game-menu">☰ Menú</button></div></header>}
    {menu && !(tv || connected) && <nav id="game-menu" className="game-menu" aria-label="Opciones del juego">
      <button className="quiet" onClick={() => { setHelp(!help); setConnectionOpen(false); setMenu(false); }}>Cómo jugar</button>
      <button className="quiet" onClick={() => { setConnectionOpen(true); setHelp(false); setMenu(false); }}>TV</button>
    </nav>}
    {help && !isTv && <HowToPlay onClose={() => setHelp(false)} />}
    {connectionOpen && !(tv || connected) && <TvConnection onConnected={confirmTv} onClose={() => setConnectionOpen(false)} onViewOnly={() => { setConnectionOpen(false); setHelp(false); setMenu(false); toggleTv(); }} />}
    <div className="play-layout"><aside className="scorecard" aria-label="Turno, marcador y controles">
      {!isTv && turnDisplay}
      <h2>Marcador</h2>
      {['x','o'].map(player => <div key={player} className={`player-card ${!game.result && game.turn === player ? 'active' : ''}`}><span className={`token ${player}`}/><div><strong>{names[player]}</strong><small>{!game.result && game.turn === player ? 'Tu turno' : `Jugador ${player === 'x' ? 1 : 2}`}</small></div><b>{scores[player]}</b></div>)}
      <div className="draw-score">Empates <strong>{scores.draw}</strong></div><button className="text-button" onClick={() => { setScores({x:0,o:0,draw:0}); reset(); }}>Reiniciar marcador y partida</button>
      {!isTv && <><div className="sidebar-new-round">{newRoundButton}</div><p className="notice" role="status">{notice}</p></>}
    </aside><section className="arena" aria-label="Cuatro en raya">
      {isTv && turnDisplay}
      <div className={`board-wrap turn-${game.turn}`}><div className="column-controls">{Array.from({length:7},(_,col) => <button key={col} ref={el => { columns.current[col] = el; }} className={selected === col ? 'selected' : ''} aria-label={`Soltar ficha en columna ${col+1}`} disabled={Boolean(game.result) || game.board[0][col] !== 'W'} onFocus={() => setSelected(col)} onMouseEnter={() => setSelected(col)} onClick={() => drop(col)} onKeyDown={event => {
        if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); const step = event.key === 'ArrowLeft' ? -1 : 1; for (let i=1;i<=7;i++) { const next=(col+step*i+7)%7; if (!columns.current[next]?.disabled) { columns.current[next].focus(); break; } } }
      }}>↓</button>)}</div><div className="grid" aria-label="Tablero de seis filas y siete columnas">{game.board.flatMap((row,r) => row.map((cell,c) => <div key={`${r}-${c}`} className={`cell ${cell} ${game.line.some(([lr,lc]) => lr===r && lc===c) ? 'winning' : ''} ${game.last?.[0]===r && game.last?.[1]===c ? 'last' : ''}`}><span className="disc" role="img" aria-label={`Fila ${r+1}, columna ${c+1}: ${cell==='W' ? 'vacía' : names[cell]}`}/><button className="cell-hit" tabIndex={-1} aria-hidden="true" disabled={Boolean(game.result) || game.board[0][c] !== 'W'} onMouseEnter={() => setSelected(c)} onClick={() => drop(c)}/></div>))}</div></div>
      {isTv && <><div className="board-footer">{newRoundButton}</div><p className="notice" role="status">{notice}</p></>}
    </section></div>
    {(tv || connected) && <div className="tv-bottom"><button className="quiet" onClick={() => connected ? disconnectDialog.current.showModal() : toggleTv()}>{connected ? 'Desconectar PC de la TV' : 'Salir de Vista TV'}</button></div>}
    <dialog ref={disconnectDialog} className="disconnect-dialog" aria-labelledby="disconnect-title">
      <h2 id="disconnect-title">Desconectar de la TV</h2>
      {connectionMethod === 'cast' && <p>En Chrome, abre <strong>Transmitir</strong> y pulsa <strong>Detener transmisión</strong>. Después confirma aquí para volver a la vista normal.</p>}
      {connectionMethod === 'miracast' && <p>En Windows, pulsa <strong>Win + K</strong> y elige <strong>Desconectar</strong>. Después confirma aquí para volver a la vista normal.</p>}
      {connectionMethod === 'hdmi' && <p>En Windows, pulsa <strong>Win + P → Solo pantalla de PC</strong>, o desconecta el cable HDMI. Después confirma aquí para volver a la vista normal.</p>}
      <p>La partida se conserva.</p>
      <div className="dialog-actions"><button className="quiet" onClick={() => disconnectDialog.current.close()}>Cancelar</button><button className="primary" onClick={disconnectTv}>Ya he desconectado</button></div>
    </dialog>
  </main>;
}
