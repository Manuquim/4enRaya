# 4 en raya · Una más

Juego local para dos personas con React y Vite. Original: https://github.com/manuquim/4enRaya

## Ejecutar

Requiere Node.js 18 o posterior. En Windows usa npm.cmd si PowerShell bloquea npm.

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Abre la dirección que muestra Vite. Desde otro dispositivo en la misma red, usa la IP local del ordenador y ese puerto; el firewall debe permitir acceso.

## Jugar

Pulsa un hueco o la flecha de una columna. Con teclado: Tab para enfocar, flechas para cambiar columna, Enter o espacio para jugar. Conecta cuatro en horizontal, vertical o diagonal. Al terminar se bloquea el tablero y se resalta la línea ganadora.

Nueva partida conserva el marcador. Reiniciar marcador y partida lo pone a cero. El marcador dura mientras la página esté abierta.

## TV

Conecta el ordenador por HDMI o duplica la pantalla con las funciones de tu dispositivo. Pulsa Vista TV para ampliar el tablero y solicitar pantalla completa. Escape sale de pantalla completa. Si el navegador no la admite, se conserva el diseño ampliado y aparece un aviso.

Vista TV no descubre televisores ni transmite directamente a Chromecast o AirPlay; la duplicación depende del sistema y del televisor.

## Validación y compilación

```sh
npm test
npm run lint
npm run build
```

La carpeta dist contiene la web estática. La base relativa permite servirla bajo /4enRaya/. Los cambios locales no se publican automáticamente en GitHub Pages.
