# 4 en raya · Una más

Juego local para dos personas con React y Vite. Original: https://github.com/manuquim/4enRaya

## Jugar sin instalar paquetes

El repositorio incluye **dist**, con el frontend precompilado. Funciona en Windows y Linux con **Node.js 18 o posterior**. No necesitas `npm install`, Vite ni la carpeta node_modules. El servidor utiliza solo funciones incluidas en Node.js y escucha únicamente en el propio PC. Para transmitir a la TV, usa la opción TV del juego.

### Descargar el juego

1. Abre [el repositorio en GitHub](https://github.com/Manuquim/4enRaya).
2. Selecciona la rama **gh-pages** si no está ya seleccionada.
3. Pulsa el botón verde **Code → Download ZIP**.
4. Extrae el ZIP antes de ejecutar el juego. Dentro encontrarás dist, scripts y los lanzadores.

El ZIP del repositorio incluye todo lo necesario para jugar, excepto Node.js. Si ya lo tienes instalado, no tienes que instalar nada más. Comprueba la versión con `node --version` en una terminal; debe ser 18 o posterior.

### Windows

1. Haz clic derecho sobre el ZIP y selecciona **Extraer todo**.
2. Abre la carpeta extraída donde aparece **iniciar.cmd**.
3. Haz doble clic en **iniciar.cmd**. Si Node.js no está instalado o no se reconoce, instálalo antes de continuar y vuelve a abrir el lanzador.
4. Deja abierta la ventana del servidor y abre **http://127.0.0.1:8080/** en el navegador.
5. Para detener el juego, pulsa **Ctrl+C** en la ventana del servidor o ciérrala.

### Linux

Sí: se usa exactamente el mismo frontend precompilado y servidor, con un lanzador de terminal en lugar del archivo cmd.

1. Extrae el ZIP con el gestor de archivos.
2. Abre una terminal dentro de la carpeta extraída donde aparece **iniciar.sh**.
3. Ejecuta:

```sh
sh iniciar.sh
```

4. Deja abierta la terminal y abre **http://127.0.0.1:8080/** en el navegador.
5. Para detener el servidor, pulsa **Ctrl+C**.

No necesitas dar permisos de ejecución si lo lanzas con `sh iniciar.sh`. También puedes ejecutar `node scripts/serve-dist.mjs` desde la carpeta del proyecto, tanto en Linux como en Windows.

### Si no se abre

- **Node.js no se reconoce:** comprueba su instalación con `node --version` y vuelve a abrir la terminal.
- **El puerto 8080 está ocupado:** cierra el otro servidor del juego o la aplicación que lo está usando y vuelve a iniciar.
- **La página deja de funcionar:** comprueba que la ventana del servidor sigue abierta.
- **Faltan archivos:** extrae el ZIP completo; conserva dist y scripts junto a los lanzadores.

También puedes alojar el contenido de dist en cualquier servidor web estático. En ese caso, los jugadores solo necesitan un navegador; no requieren Node.js ni paquetes.

El archivo compacto de distribución cuatro-en-raya.zip, si se facilita por separado, contiene dist, scripts y los lanzadores de Windows y Linux. **Download ZIP** de GitHub descarga el repositorio completo. Abre el juego mediante el servidor: abrir index.html directamente como archivo puede bloquear los módulos JavaScript.

## Desarrollar

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

La carpeta dist contiene la web estática y se incluye en Git. La base relativa permite servirla bajo /4enRaya/. Después de modificar el código, ejecuta `npm run build` y sube también los cambios de dist para actualizar la versión precompilada. La subida a GitHub no sustituye por sí sola el despliegue del contenido de dist. Sin una TV real conectada no se puede validar la transmisión física.

El panel TV es una ventana modal: se cierra al pulsar fuera de él, con Escape o con su botón de cierre. Mientras está abierto bloquea el tablero, de modo que el clic exterior no coloca fichas. El foco de teclado permanece dentro del panel.
