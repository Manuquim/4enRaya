import { useEffect, useState } from 'react';
import { checkChallenge, createChallenge } from '../funciones/tvTest';

// The parent owns menu visibility and the confirmed TV view.
// eslint-disable-next-line react/prop-types
export default function TvConnection({ onConnected, onClose, onViewOnly }) {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');
  const [method, setMethod] = useState('cast');
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
    if (result === 'confirmed') onConnected(method);
  }

  return <section className="tv-connection" aria-label="Opciones de TV">
    <div id="tv-connection-panel" className="help">
      <button className="quiet" onClick={onClose}>Cerrar opciones de TV</button>
      <h2>TV · Elige el modo</h2>
      <p>Elige cómo mostrar el juego. La compatibilidad depende del televisor y del PC, no de la marca.</p>
      <label className="tv-method-label" htmlFor="tv-method">Modo de uso</label>
      <select id="tv-method" className="tv-method" value={method} onChange={event => { setMethod(event.target.value); setChallenge(null); setAnswer(''); setStatus('idle'); }}>
        <option value="cast">Google Cast / Chromecast · Wi-Fi</option>
        <option value="miracast">Miracast · Windows inalámbrico</option>
        <option value="hdmi">Cable HDMI</option>
        <option value="view">Solo vista ampliada / pantalla completa</option>
      </select>
      {method === 'view' && <><p>Amplía el tablero y solicita pantalla completa en esta pantalla. Este modo no establece una conexión con una TV.</p><button className="primary" onClick={onViewOnly}>Activar vista ampliada</button></>}
      {method === 'cast' && <><ol><li>Enciende la TV y conecta el PC y la TV a la misma Wi-Fi.</li><li>La TV debe admitir Google Cast o tener un Chromecast conectado. En Chrome busca <strong>Transmitir</strong>, selecciona <strong>Transmitir pestaña</strong> y elige tu TV.</li></ol><a className="tv-guide" href="https://support.google.com/chromecast/answer/3228332?hl=es" target="_blank" rel="noreferrer">Guía de Google Cast ↗</a></>}
      {method === 'miracast' && <><ol><li>Comprueba que el PC y la TV admiten Miracast. Activa en la TV su opción de pantalla inalámbrica o duplicación.</li><li>En Windows pulsa <strong>Win + K</strong>, elige la TV y acepta la conexión si lo solicita.</li><li>Usa <strong>Win + P → Duplicar</strong> para mostrar la misma pantalla.</li></ol><a className="tv-guide" href="https://support.microsoft.com/en-gb/windows/hardware/display-graphics/screen-mirroring-and-projecting-to-your-pc-or-wireless-display" target="_blank" rel="noreferrer">Guía de pantalla inalámbrica ↗</a></>}
      {method === 'hdmi' && <ol><li>Conecta el PC a una entrada HDMI de la TV y selecciona esa entrada con el mando.</li><li>En Windows usa <strong>Win + P → Duplicar</strong> para mostrar la pantalla del PC.</li></ol>}
      {method !== 'view' && <>
      <p>Cuando veas el juego en la TV, inicia el test, comprueba allí el código y confírmalo desde el PC.</p>
      <p>La prueba es visual y requiere tu confirmación. No detecta la TV automáticamente ni comprueba respuestas del mando. Las jugadas se hacen desde el PC.</p>
      <button className="primary" onClick={start}>{challenge ? 'Generar otro test' : 'Iniciar test visual'}</button>
      {challenge && <div className="tv-test">
        <div className="tv-test-display"><span className="eyebrow">CÓDIGO DE PRUEBA · MÍRALO EN LA TV</span><strong className="tv-code">{challenge.code}</strong><div className={`tv-signal ${['waiting', 'incorrect'].includes(status) ? 'running' : ''}`} aria-hidden="true"><span/><span/><span/></div></div>
        {['waiting', 'incorrect'].includes(status) && <form onSubmit={confirm}><label htmlFor="tv-answer">Escribe el código que ves en la TV (válido durante 60 segundos)</label><div className="tv-test-actions"><input id="tv-answer" value={answer} onChange={event => setAnswer(event.target.value.replace(/\D/g, '').slice(0,4))} inputMode="numeric" autoComplete="off" pattern="[0-9]{4}" maxLength={4} required placeholder="4 cifras"/><button className="primary" type="submit">Confirmar imagen</button></div></form>}
        <p className="tv-test-result" role="status">{status === 'confirmed' ? 'Imagen confirmada por ti. Coloca una ficha y comprueba que también aparece en la TV.' : status === 'expired' ? 'El test ha caducado. Genera otro cuando la TV esté transmitiendo.' : status === 'incorrect' ? 'El código no coincide. Comprueba la imagen en la TV y vuelve a intentarlo.' : 'Pendiente de confirmación. Si la TV no muestra este código, la transmisión aún no está comprobada.'}</p>
      </div>}
      <details><summary>La TV no aparece o no muestra el juego</summary>
        {method === 'cast' && <p>Comprueba que Chrome está actualizado y que la TV admite Google Cast o tiene un Chromecast. Evita redes de invitados que aíslan los dispositivos. Detén y reinicia la transmisión si la imagen no se actualiza.</p>}
        {method === 'miracast' && <p>Comprueba que ambos dispositivos admiten Miracast y que la TV tiene activa la duplicación inalámbrica. Si no aparece en Win + K, prueba Google Cast o HDMI.</p>}
        {method === 'hdmi' && <p>Comprueba el cable, la entrada HDMI seleccionada en la TV y la opción Duplicar en el PC.</p>}
      </details>
      </>}
    </div>
  </section>;
}
