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

En PC, el 20 % izquierdo de la zona de juego contiene turno, marcador y controles; el 80 % restante se reserva para el tablero, cuyo tamaño se ajusta a la altura disponible. En ventanas estrechas los controles se agrupan sobre el tablero. El menú y la configuración se abren en paneles superpuestos.

## Conectar a una TV

Abre **Menú → TV** y elige el modo en el panel posterior. No se restringe la marca ni el modelo; cada dispositivo debe admitir el método elegido.

- **Google Cast / Chromecast:** conecta PC y TV a la misma Wi-Fi. En Chrome usa Transmitir → Transmitir pestaña y elige la TV. La Xiaomi TV A 2025 es un ejemplo de TV con Chromecast integrado; otros modelos compatibles también sirven.
- **Miracast:** PC y TV deben admitirlo. Activa la pantalla inalámbrica en la TV y conéctala desde Windows con Win + K. Usa Win + P → Duplicar para ver la misma imagen.
- **HDMI:** conecta el cable, selecciona la entrada en la TV y usa Win + P → Duplicar en Windows.
- **Solo vista ampliada / pantalla completa:** amplía el tablero sin configurar una conexión ni ejecutar el test visual.

La web ofrece instrucciones; la conexión se establece desde Chrome, Windows o el cable. No descubre televisores ni inicia o detiene automáticamente la transmisión.

## Test visual

Genera un código de cuatro cifras válido durante 60 segundos y una señal animada. Mira el código en la TV y confírmalo desde el PC. Los códigos incorrectos y las pruebas caducadas se rechazan. Al confirmar se cierra la configuración y queda la partida con el botón inferior **Desconectar PC de la TV**. Coloca una ficha para comprobar que la imagen sigue actualizándose.

Es una confirmación manual de la imagen, no una detección automática ni una prueba bidireccional del mando. Cambiar de método elimina la prueba anterior. Las jugadas se hacen desde el PC.

El botón de desconexión explica cómo detener la conexión según el método elegido y vuelve a la vista normal tras tu confirmación, sin reiniciar la partida.

La vista TV usa un tablero grande a la izquierda y los controles a la derecha en pantallas panorámicas. Conserva fichas circulares y adapta el diseño a ventanas verticales o de poca altura. **Menú → TV → Solo vista ampliada / pantalla completa** solicita pantalla completa; Escape sale de ella. Si el navegador no la admite, se mantiene la vista ampliada. El menú principal contiene una única entrada TV.

Guías oficiales:

- Google Cast: https://support.google.com/chromecast/answer/3228332?hl=es
- Miracast en Windows: https://support.microsoft.com/en-gb/windows/hardware/display-graphics/screen-mirroring-and-projecting-to-your-pc-or-wireless-display
- Xiaomi TV A 2025: https://www.mi.com/global/product/xiaomi-tv-a-43-2025/specs/

## Validación y compilación

```sh
npm test
npm run lint
npm run build
```

La carpeta dist contiene la web estática. La base relativa permite servirla bajo /4enRaya/. Los cambios locales y la subida del código a GitHub no sustituyen por sí solos un proceso de despliegue de dist. Sin una TV real conectada no se puede validar la transmisión física.
