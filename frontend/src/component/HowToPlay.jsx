import { useEffect, useRef } from 'react';

// eslint-disable-next-line react/prop-types
export default function HowToPlay({ onClose }) {
  const panel = useRef(null);
  useEffect(() => {
    const dialog = panel.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return <dialog ref={panel} className="how-to-play" aria-labelledby="how-to-play-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <div className="help">
      <button className="quiet" onClick={onClose}>Cerrar cómo jugar</button>
      <h2 id="how-to-play-title">Una regla. Muchas posibilidades.</h2>
      <p>Elige 1 jugador contra IA o 2 jugadores locales en el panel izquierdo. Conecta cuatro en horizontal, vertical o diagonal.</p>
      <p>En solitario juegas con Coral y eliges quién empieza: tú o la IA. La IA usa Ámbar y responde automáticamente: fácil analiza 2 niveles de jugada, normal 3 y difícil 4. Cada nivel corresponde a una ficha, alternando IA y jugador. Cambiar modo, dificultad o quién empieza reinicia partida y marcador.</p>
      <p>Pulsa una columna para jugar. Con teclado, usa Tab para enfocar una columna, las flechas para cambiar de columna y Enter o espacio para soltar una ficha.</p>
      <p><strong>En tu TV:</strong> abre <strong>Menú → TV</strong> y elige tu modo de conexión o la vista ampliada.</p>
    </div>
  </dialog>;
}
