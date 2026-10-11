# 4 en raya · Una más

Juego local para dos personas con React y Vite. Original: https://github.com/manuquim/4enRaya

## Jugar sin instalar paquetes

El repositorio incluye **dist**, con el frontend precompilado. Funciona en Windows y Linux con **Node.js 18 o posterior**. No necesitas `npm install`, Vite ni la carpeta node_modules. El servidor utiliza solo funciones incluidas en Node.js y escucha únicamente en el propio PC. Para transmitir a la TV, usa la opción TV del juego.

### Inicio rápido

Descarga el paquete precompilado desde [Releases de GitHub](https://github.com/Manuquim/4enRaya/releases): [Windows](https://github.com/Manuquim/4enRaya/releases/download/v1.0.1/cuatro-en-raya-windows.zip) o [Linux](https://github.com/Manuquim/4enRaya/releases/download/v1.0.1/cuatro-en-raya-linux.zip). Extrae el ZIP completo. Necesitas Node.js instalado previamente.

La carpeta extraída solo muestra el lanzador y una carpeta app:

```text
Windows:                  Linux:
JUGAR - Windows.vbs        JUGAR - Linux.desktop
app/                      app/
```

En Windows, haz doble clic en **JUGAR - Windows.vbs**. En Linux, abre **JUGAR - Linux.desktop** si tu entorno lo permite. Si el sistema oculta las extensiones, los verás como **JUGAR - Windows** o **JUGAR - Linux - 4 en raya**. El archivo que empieza por JUGAR es el lanzador; app es la carpeta de datos. No muevas el lanzador fuera de su carpeta ni borres app.

| Sistema | Iniciar | Apagar |
| --- | --- | --- |
| Windows | Doble clic en **JUGAR - Windows.vbs**; alternativa: **app/run.cmd** | Botón **Apagar juego** o **app/detener.cmd** |
| Linux | **JUGAR - Linux.desktop** si tu escritorio lo admite; alternativa: `sh app/iniciar.sh` | Botón **Apagar juego**, **app/Detener.desktop** o `sh app/detener.sh` |
| Ambos, desde terminal | `node app/run` | `node app/run --stop` |

El navegador se abre automáticamente y el servidor queda en segundo plano. No tienes que mantener una terminal abierta.

### Un único archivo run para Windows y Linux

Ambos paquetes usan internamente el mismo archivo run, ubicado dentro de app. Si prefieres usar una terminal desde la carpeta extraída, ejecuta:

```sh
node app/run
```

El lanzador inicia el servidor en segundo plano y abre **http://127.0.0.1:8080/** en el navegador automáticamente. Puedes cerrar la terminal. Si el juego ya está iniciado, reutiliza el servidor. Para detenerlo ejecuta `node run --stop`.

No tienes que elegir la descarga según el sistema: Node.js ejecuta el mismo archivo y adapta las rutas de archivos al sistema operativo. No requiere detectar Windows o Linux ni instalar paquetes. Los lanzadores **iniciar.cmd** y **iniciar.sh** llaman internamente a este mismo archivo run.

Para iniciar con doble clic en Windows usa **JUGAR - Windows.vbs** (sin consola) o **run.cmd** (la consola se cierra tras arrancar). En Linux se incluye **JUGAR - Linux.desktop**, para los entornos que permiten ejecutar accesos de escritorio; también puedes usar **sh iniciar.sh**. Todos llaman al mismo archivo run.

### Descargar el juego

Para jugar con la estructura compacta usa los ZIP de **Releases**, indicados arriba. **Code → Download ZIP** descarga el código de desarrollo y mantiene la estructura original del repositorio. Si eliges esa descarga:

1. Abre [el repositorio en GitHub](https://github.com/Manuquim/4enRaya).
2. Selecciona la rama **gh-pages** si no está ya seleccionada.
3. Pulsa el botón verde **Code → Download ZIP**.
4. Extrae el ZIP antes de ejecutar el juego. Dentro encontrarás dist, scripts y los lanzadores.

El ZIP del repositorio incluye todo lo necesario para jugar, excepto Node.js. Si ya lo tienes instalado, no tienes que instalar nada más. Comprueba la versión con `node --version` en una terminal; debe ser 18 o posterior.

Las instrucciones siguientes que usan run.cmd, iniciar.sh o detener.cmd directamente se refieren a la carpeta interna **app** en los paquetes compactos, o a la raíz si descargaste el código con Code → Download ZIP.

### Windows

1. Haz clic derecho sobre el ZIP y selecciona **Extraer todo**.
2. Abre la carpeta extraída donde aparece **JUGAR - Windows.vbs**.
3. Haz doble clic en **run.cmd**. Arranca el servidor en segundo plano y abre el navegador. La consola se cierra tras arrancar; no tienes que mantener PowerShell abierto. Necesitas Node.js instalado previamente.
4. **JUGAR - Windows.vbs** es una alternativa sin consola si Windows permite ejecutar VBScript. Ambos buscan Node.js en PATH y en sus ubicaciones habituales. Si el VBS muestra un error, abre **run.cmd** para ver la causa concreta. **iniciar.cmd** también usa el mismo lanzador.
5. Para finalizar, pulsa **Apagar juego** en la página o ejecuta **detener.cmd**.

### Linux

Se usa el mismo frontend y servidor. El lanzador inicia el proceso en segundo plano y abre el navegador con xdg-open, sin dejar una terminal abierta.

1. Extrae el ZIP con el gestor de archivos.
2. Si tu entorno de escritorio permite ejecutar archivos desktop, abre **JUGAR - Linux.desktop**. Puede solicitar permiso de ejecución o marcarlo como confiable la primera vez. Conserva el acceso en la carpeta extraída, junto a iniciar.sh.
3. Si el escritorio no permite lanzar ese acceso, abre una terminal en la carpeta extraída y ejecuta:

```sh
sh iniciar.sh
```

4. El navegador se abre automáticamente. Puedes cerrar la terminal.
5. Para finalizar, pulsa **Apagar juego** en la página. También puedes abrir **Detener.desktop** si tu escritorio lo admite, o ejecutar `sh detener.sh` o `node run --stop`.

No necesitas dar permisos de ejecución si lo lanzas con `sh iniciar.sh`. También puedes ejecutar `node run` desde la carpeta del proyecto, tanto en Linux como en Windows.

### Apagar el juego y liberar el puerto

El botón **Apagar juego** funciona en Windows y Linux con el lanzador local actualizado. Está debajo de **Nueva partida** en el panel izquierdo y junto a la desconexión en la vista TV.

Al pulsarlo:

1. Detiene el proceso del servidor del juego.
2. Cierra sus conexiones y libera el puerto **8080**, o el puerto configurado.
3. Muestra **Juego apagado**. Puedes cerrar la pestaña; para volver a jugar, abre de nuevo el lanzador.

Solo se detiene el proceso del juego: no se terminan otros programas ni servicios. Cerrar la pestaña por sí solo no detiene el servidor. Si estabas transmitiendo a la TV, detén también la transmisión desde Chrome o Windows.

Si no puedes acceder a la página, usa el lanzador de apagado de tu sistema o `node run --stop`. El comando también se puede ejecutar si el servidor ya está detenido.

En **GitHub Pages**, un servidor estático o el modo de desarrollo con Vite, el botón no puede apagar el servidor local del lanzador y muestra un aviso. Para usar esta función, descarga el ZIP actualizado y arranca con Run. Si actualizas una copia que estaba abierta, detén primero el servidor anterior.

### Si no se abre

- **Node.js no se reconoce:** comprueba su instalación con `node --version` y vuelve a abrir la terminal.
- **El puerto 8080 está ocupado:** cierra el otro servidor del juego o la aplicación que lo está usando y vuelve a iniciar.
- **El navegador no se abre:** entra manualmente en http://127.0.0.1:8080/; en Linux comprueba que xdg-open esté disponible.
- **Error al iniciar:** usa run.cmd en Windows o `node run` en una terminal para ver el mensaje. El servidor registra errores en servidor.log.
- **JUGAR - Windows.vbs muestra «No se pudo iniciar»:** usa run.cmd. Descarga y extrae el ZIP actualizado completo, comprueba Node.js 18 o posterior y revisa si otro programa ocupa el puerto 8080. El archivo run sin extensión contiene JavaScript y se ejecuta con Node.js; no es un acceso de Windows para doble clic.
- **JUGAR - Windows.vbs parece no hacer nada:** la versión actual muestra un mensaje de resultado después del arranque y abre la URL directamente con Windows. Si indica que el servidor está iniciado pero no ves el navegador, abre http://127.0.0.1:8080/ manualmente. Si no aparece ningún mensaje, usa run.cmd; Windows puede tener desactivada la ejecución de archivos VBS o una asociación de archivos diferente.
- **Se muestra una versión antigua:** detén el servidor anterior antes de iniciar una descarga nueva.
- **Faltan archivos:** extrae el ZIP completo; conserva run, dist y scripts junto a los lanzadores.

También puedes alojar el contenido de dist en cualquier servidor web estático. En ese caso, los jugadores solo necesitan un navegador; no requieren Node.js ni paquetes.

El archivo cuatro-en-raya.zip, si se facilita por separado, es el paquete compacto de Windows. Los archivos cuatro-en-raya-windows.zip y cuatro-en-raya-linux.zip contienen un único lanzador exterior y el resto dentro de app. Abre el juego mediante el servidor: abrir index.html directamente como archivo puede bloquear los módulos JavaScript.

El arranque no instala servicios, tareas programadas ni modifica la política de PowerShell. El servidor dura hasta que lo detienes o reinicias el equipo. Para ejecutarlo en primer plano y cerrarlo con Ctrl+C, usa `node scripts/serve-dist.mjs`.

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

Para generar los paquetes compactos después de compilar, ejecuta `node scripts/package.mjs`. En Windows usa el compresor incluido en PowerShell; en Linux requiere el comando zip. Estas herramientas solo son necesarias para generar los paquetes, no para jugar.

Los paneles **TV** y **Cómo jugar** son ventanas modales: se cierran al pulsar fuera, con Escape o con su botón de cierre. Mientras están abiertos bloquean el tablero, de modo que el clic exterior no coloca fichas. El foco de teclado permanece dentro del panel.

Las pruebas incluyen la lógica de juego, el test visual de TV y el ciclo del servidor: arranque en segundo plano, reutilización sin duplicar procesos, rechazo de apagados sin autorización, terminación del proceso y disponibilidad del puerto después de apagar.
