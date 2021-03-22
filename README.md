# calc-tolls-price

## INEGI

Para inegi, tiene que correr `node mexico/inegi/index.js`, pero antes tiene que añadir una key valida, la cual puede obtener en http://gaia.inegi.org.mx/sakbe_v3.1/genera_token.jsp

Esta llave la reemplaza en la variable de `apiKey`.

## MANUAL

Este es para tener los datos manualmente, estos datos son de http://app.sct.gob.mx/sibuac_internet/ControllerUI?action=cmdEscogeRuta

En el archivo `script.js` puede encontrar que la función `main` toma un arreglo, el cual tiene los origenes y destinos. En este, tiene que cambiar los origenes y destinos, basado en el archivo `data.json`, este ya tiene un listado, para que haga la prueba, pero ya es decisión suya cambiarlo. Este toma los ejes de camiones por defecto, como lo ve aquí:

`const ejes = Array.from({ length: 8 }, (_, i) => i + 2);` (linea 64)

Este le entrega la suma de las casetas, el valor total, para obtener el precio que necesita, mire el archivo `basic.js`, en este encuentra un pequeño codigo comentado, el cual le ayudará a obtener el precio correcto basado en su camión y precio de gasolina actual, eso sí, le recomiendo tomar la distancia en kilometros de google maps, no de esta página del gobierno ;).

## Ayuda

Cualquier duda, al correo: andresmontoyafcb@gmail.com
