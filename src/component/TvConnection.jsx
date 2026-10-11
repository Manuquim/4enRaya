import { useEffect, useState } from 'react';
import { checkChallenge, createChallenge } from '../funciones/tvTest';

// The parent owns menu visibility and the confirmed TV view.
// eslint-disable-next-line react/prop-types
export default function TvConnection({ onConnected, onClose }) {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    if (!challenge || !['waiting', 'incorrect'].includes(status)) return;
    const timer = setTimeout(() => setStatus('expired'), Math.max(0, challenge.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [challenge, status]);

  function start() {
    setChallenge(createChallenge());
    setAnswer('');
    setStatus('waiting');
  }

  function confirm(event) {
    event.preventDefault();
    const result = checkChallenge(challenge, answer);
    setStatus(result);
    if (result === 'confirmed') onConnected();
  }

  return <section className="tv-connection" aria-label="Conexión con Xiaomi TV">
    <div id="tv-connection-panel" className="help">
      <button className="quiet" onClick={onClose}>Cerrar conexión TV</button>
      <h2>Tu Xiaomi, por Wi-Fi</h2>
      <ol><li>Enciende la TV y conecta el PC y la TV a la misma Wi-Fi.</li><li>Abre este juego en Chrome. En su menú busca <strong>Transmitir</strong>, selecciona <strong>Transmitir pestaña</strong> y elige tu Xiaomi TV.</li><li>Inicia el test y comprueba el código y la señal en movimiento en la televisión. Después confirma el código desde el PC.</li></ol>
      <p>La prueba es visual y requiere tu confirmación. No detecta la TV automáticamente ni comprueba respuestas del mando. Las jugadas se hacen desde el PC.</p>
      <button className="primary" onClick={start}>{challenge ? 'Generar otro test' : 'Iniciar test visual'}</button>
      {challenge && <div className="tv-test">
        <div className="tv-test-display"><span className="eyebrow">CÓDIGO DE PRUEBA · MÍRALO EN LA TV</span><strong className="tv-code">{challenge.code}</strong><div className={`tv-signal ${['waiting', 'incorrect'].includes(status) ? 'running' : ''}`} aria-hidden="true"><span/><span/><span/></div></div>
        {['waiting', 'incorrect'].includes(status) && <form onSubmit={confirm}><label htmlFor="tv-answer">Escribe el código que ves en la TV (válido durante 60 segundos)</label><div className="tv-test-actions"><input id="tv-answer" value={answer} onChange={event => setAnswer(event.target.value.replace(/\D/g, '').slice(0,4))} inputMode="numeric" autoComplete="off" pattern="[0-9]{4}" maxLength={4} required placeholder="4 cifras"/><button className="primary" type="submit">Confirmar imagen</button></div></form>}
        <p className="tv-test-result" role="status">{status === 'confirmed' ? 'Imagen confirmada por ti. Coloca una ficha y comprueba que también aparece en la TV.' : status === 'expired' ? 'El test ha caducado. Genera otro cuando la TV esté transmitiendo.' : status === 'incorrect' ? 'El código no coincide. Comprueba la imagen en la TV y vuelve a intentarlo.' : 'Pendiente de confirmación. Si la TV no muestra este código, la transmisión aún no está comprobada.'}</p>
      </div>}
      <details><summary>La TV no aparece o no muestra el juego</summary><p>Comprueba que Chrome está actualizado, la TV está encendida y has seleccionado transmitir la pestaña del juego. Evita redes de invitados que aíslan los dispositivos. Si aparece una imagen antigua, detén la transmisión y vuelve a iniciarla. Vista TV solo amplía el tablero.</p></details>
    </div>
  </section>;
}
