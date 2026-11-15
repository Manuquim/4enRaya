import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { freshGame, advanceGame } from './funciones/gameState';
import { computerMove } from './funciones/computer';
import confetti from 'canvas-confetti';
import './App.css';
import TvConnection from './component/TvConnection';
import HowToPlay from './component/HowToPlay';
const names = { x: 'Coral', o: 'Ámbar' };
const levels = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };
export default function App() {
  const [game, setGame] = useState(freshGame);
  const [mode, setMode] = useState('single');
  const [difficulty, setDifficulty] = useState('normal');
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [selected, setSelected] = useState(3);
  const [tv, setTv] = useState(false);
  const [notice, setNotice] = useState('');
  const [help, setHelp] = useState(false);
  const [menu, setMenu] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState('cast');
  const [shuttingDown, setShuttingDown] = useState(false);
  const [poweredOff, setPoweredOff] = useState(false);
  const disconnectDialog = useRef(null);
  const columns = useRef([]);
  const lock = useRef(false);
  const computerVersion = useRef(0);
  const thinking = mode === 'single' && game.turn === 'o' && !game.result && !poweredOff && !shuttingDown;
  useEffect(() => { lock.current = false; }, [game]);
  useEffect(() => {
    const change = () => { if (!document.fullscreenElement) setTv(false); };
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  const applyMove = useCallback((col, actor = 'human') => {
    if (lock.current) return;
    const next = advanceGame(game, col, mode, actor);
    if (next === game) return;
    lock.current = true;
    setGame(next);
    setNotice('');
    if (next.result) {
      setScores(old => ({ ...old, [next.result]: old[next.result] + 1 }));
      if (next.result !== 'draw') confetti({ particleCount: 90, spread: 65, disableForReducedMotion: true });
    }
  }, [game, mode]);
  useEffect(() => {
    if (!thinking) return;
    const version = computerVersion.current;
    let active = true, worker;
    const complete = col => {
      if (active && version === computerVersion.current) applyMove(col, 'computer');
    };
    const fallback = () => complete(computerMove(game.board, 'easy'));
    const timer = setTimeout(() => {
      try {
        worker = new Worker(new URL('./funciones/computer.worker.js', import.meta.url), { type: 'module' });
        worker.onmessage = event => complete(event.data);
        worker.onerror = () => { worker.terminate(); fallback(); };
        worker.postMessage({ board: game.board, difficulty });
      } catch { fallback(); }
    }, 400);
    return () => { active = false; clearTimeout(timer); worker?.terminate(); };
  }, [thinking, game, difficulty, applyMove]);

  function drop(col) {
    if (thinking || shuttingDown) return;
    if (game.board[0][col] !== 'W' && !game.result) { setNotice('Columna llena. Elige otra.'); return; }
    applyMove(col);
  }
  function reset() {
    computerVersion.current++;
    lock.current = false;
    setGame(freshGame()); setNotice('');
  }
  function changeSettings(nextMode, nextDifficulty) {
    reset();
    setMode(nextMode); setDifficulty(nextDifficulty);
    setScores({ x: 0, o: 0, draw: 0 });
  }
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
  async function shutdown() {
    if (shuttingDown) return;
    setShuttingDown(true);
    try {
      const health = await fetch('/__4enraya/health', { signal: AbortSignal.timeout(2000), cache: 'no-store' });
      if (!health.ok) throw new Error();
      const info = await health.json();
      if (info.name !== '4enraya' || !info.token) throw new Error();
      const stopped = await fetch('/__4enraya/stop', { method: 'POST', headers: { Authorization: `Bearer ${info.token}` }, signal: AbortSignal.timeout(3000) });
      if (!stopped.ok) throw new Error();
      await stopped.text();
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setPoweredOff(true);
    } catch {
      setNotice('No se pudo apagar el servidor. Esta opción requiere abrir el juego con el lanzador local actualizado; también puedes usar Detener.');
    } finally { setShuttingDown(false); }
  }
  const status = game.result === 'draw' ? '¡Empate!' : game.result
    ? mode === 'single' ? game.result === 'x' ? '¡Has ganado!' : '¡Gana la IA!' : `¡${names[game.result]} gana!`
    : thinking ? 'IA pensando…' : mode === 'single' ? 'Tu turno' : `Turno de ${names[game.turn]}`;
  const isTv = tv || connected;
  const turnDisplay = <div className="game-status" role="status"><span className={`token status-dot ${game.turn}`}/><strong>{status}</strong><span className="move-count">{game.moves} / 42</span>{game.result && <span className="game-mode-badge">Partida terminada. Pulsa Jugar otra vez para empezar.</span>}{isTv && <span className="game-mode-badge">{mode === 'single' ? `Tú contra IA · ${levels[difficulty]}` : '2 jugadores'}</span>}</div>;
  const newRoundButton = <button className="primary" onClick={reset}>{game.result ? 'Jugar otra vez ↗' : 'Nueva partida ↗'}</button>;
  const shutdownButton = <button className="quiet shutdown-button" disabled={shuttingDown} onClick={shutdown}>{shuttingDown ? 'Apagando…' : '⏻ Apagar juego'}</button>;
  if (poweredOff) return <main className="powered-off" role="status"><h1>Juego apagado</h1><p>El servidor del juego se ha detenido y su puerto queda libre.</p><p>Puedes cerrar esta pestaña. Para volver a jugar, abre el lanzador Run.</p>{connected && <p>Si estabas transmitiendo a la TV, detén también la transmisión en Chrome o Windows.</p>}</main>;
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
      {!isTv && <div className="match-settings">
        <label htmlFor="match-mode">Jugadores</label>
        <select id="match-mode" value={mode} disabled={Boolean(game.result)} onChange={event => changeSettings(event.target.value, difficulty)}><option value="single">1 jugador · contra IA</option><option value="two">2 jugadores · local</option></select>
        {mode === 'single' && <><label htmlFor="ai-level">Dificultad</label><select id="ai-level" value={difficulty} disabled={Boolean(game.result)} onChange={event => changeSettings(mode, event.target.value)}><option value="easy">Fácil</option><option value="normal">Normal</option><option value="hard">Difícil</option></select></>}
        <small>{game.result ? 'Pulsa Jugar otra vez para iniciar una nueva partida.' : 'Cambiar estas opciones inicia partida y marcador.'}</small>
      </div>}
      <h2>Marcador</h2>
      {['x','o'].map(player => <div key={player} className={`player-card ${!game.result && game.turn === player ? 'active' : ''}`}><span className={`token ${player}`}/><div><strong>{names[player]}</strong><small>{mode === 'single' ? player === 'x' ? 'Tú' : `IA · ${levels[difficulty]}` : `Jugador ${player === 'x' ? 1 : 2}`}</small></div><b>{scores[player]}</b></div>)}
      <div className="draw-score">Empates <strong>{scores.draw}</strong></div><button className="text-button" onClick={() => { setScores({x:0,o:0,draw:0}); reset(); }}>Reiniciar marcador y partida</button>
      {!isTv && <><div className="sidebar-new-round">{newRoundButton}{shutdownButton}</div><p className="notice" role="status">{notice}</p></>}
    </aside><section className="arena" aria-label="Cuatro en raya" aria-busy={thinking}>
      {isTv && turnDisplay}
      <div className={`board-wrap turn-${game.turn}`}><div className="column-controls">{Array.from({length:7},(_,col) => <button key={col} ref={el => { columns.current[col] = el; }} className={selected === col ? 'selected' : ''} aria-label={`Soltar ficha en columna ${col+1}`} disabled={thinking || shuttingDown || Boolean(game.result) || game.board[0][col] !== 'W'} onFocus={() => setSelected(col)} onMouseEnter={() => setSelected(col)} onClick={() => drop(col)} onKeyDown={event => {
        if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); const step = event.key === 'ArrowLeft' ? -1 : 1; for (let i=1;i<=7;i++) { const next=(col+step*i+7)%7; if (!columns.current[next]?.disabled) { columns.current[next].focus(); break; } } }
      }}>↓</button>)}</div><div className="grid" aria-label="Tablero de seis filas y siete columnas">{game.board.flatMap((row,r) => row.map((cell,c) => <div key={`${r}-${c}`} className={`cell ${cell} ${game.line.some(([lr,lc]) => lr===r && lc===c) ? 'winning' : ''} ${game.last?.[0]===r && game.last?.[1]===c ? 'last' : ''}`}><span className="disc" role="img" aria-label={`Fila ${r+1}, columna ${c+1}: ${cell==='W' ? 'vacía' : names[cell]}`}/><button className="cell-hit" tabIndex={-1} aria-hidden="true" disabled={thinking || shuttingDown || Boolean(game.result) || game.board[0][c] !== 'W'} onMouseEnter={() => setSelected(c)} onClick={() => drop(c)}/></div>))}</div></div>
      {isTv && <><div className="board-footer">{newRoundButton}</div><p className="notice" role="status">{notice}</p></>}
    </section></div>
    {(tv || connected) && <div className="tv-bottom"><button className="quiet" onClick={() => connected ? disconnectDialog.current.showModal() : toggleTv()}>{connected ? 'Desconectar PC de la TV' : 'Salir de Vista TV'}</button>{shutdownButton}</div>}
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
