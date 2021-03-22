const fetch = require("node-fetch");
const { parse } = require("node-html-parser");

const json = require("./data.json");

const ENDPOINT = "http://aplicaciones4.sct.gob.mx/sibuac_internet/ControllerUI";
const COMBUSTIBLE = 21.567; // Combustible actual dependiendo de gasolina
const RENDIMIENTO = 12; // Rendimiento gasolina KM/Litro
const EJES_CAMION = {
  2: 9,
  3: 10,
  4: 11,
  5: 12,
  6: 13,
  7: 14,
  8: 15,
  9: 16,
};

async function fuelPrices(
  estadoOrigen,
  ciudadOrigen,
  estadoDestino,
  ciudadDestino,
  ejeCamion
) {
  const url = new URL(ENDPOINT);
  const query = {
    action: "cmdSolRutas",
    tipo: 1,
    red: "simplificada",
    edoOrigen: estadoOrigen,
    ciudadOrigen: ciudadOrigen,
    edoDestino: estadoDestino,
    ciudadDestino: ciudadDestino,
    vehiculos: EJES_CAMION[ejeCamion],
    rendimiento: RENDIMIENTO,
    combustible: COMBUSTIBLE,
  };
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));

  const response = await fetch(url);
  const html = await response.text();

  const root = parse(html);

  const table = root.querySelector("#tContenido");
  const trs = table.querySelectorAll(".tr_gris");
  const tr = trs.slice(-3)[0];
  const td = parseFloat(tr.querySelectorAll("td")[4].text.replace(/,/g, ""));
  console.log(`
    eje de camion: ${ejeCamion}
    estado origen: ${estadoOrigen}
    ciudad origen: ${ciudadOrigen}
    estado destino: ${estadoDestino}
    ciudad destino: ${ciudadDestino}
    precio: ${td}
  `);
  return td;
}

async function main(ciudades) {
  let response = {};
  const ejes = Array.from({ length: 8 }, (_, i) => i + 2);

  for (let ciudad of ciudades) {
    const origen = json["puntos"][ciudad.origen];
    const destino = json["puntos"][ciudad.destino];

    for (let eje of ejes) {
      let fuelPrice = await fuelPrices(
        origen.estado,
        ciudad.origen,
        destino.estado,
        ciudad.destino,
        eje
      );

      response = {
        ...response,
        [`${origen.nombre} - ${destino.nombre}`]: {
          ...response[`${origen.nombre} - ${destino.nombre}`],
          [`camion eje ${eje}`]: fuelPrice,
        },
      };
    }
  }

  console.log(response);
}

main([
  {
    origen: 14160,
    destino: 11180,
  },
  {
    origen: 14160,
    destino: 21180,
  },
  {
    origen: 14160,
    destino: 24170,
  },
  {
    origen: 14160,
    destino: 22110,
  },
  {
    origen: 9010,
    destino: 19330,
  },
  {
    origen: 9010,
    destino: 1010,
  },
  {
    origen: 9010,
    destino: 14320,
  },
]);
