const fetch = require("node-fetch");
const { parse } = require("node-html-parser");

const json = require("./data.json");

const ENDPOINT = "http://aplicaciones4.sct.gob.mx/sibuac_internet/ControllerUI";

const COMBUSTIBLE = 21.567; // Combustible actual dependiendo de gasolina
const RENDIMIENTO = 12; // Rendimiento gasolina KM/Litro
const DISTANCIA_KILOMETROS = 5510; // Distancia en kilometros de punto A al B

const ciudadOrigen = "14160";
const ciudadDestino = "9010";

const estadoOrigen = json["puntos"][ciudadOrigen]["estado"];
const estadoDestino = json["puntos"][ciudadDestino]["estado"];

const query = {
  action: "cmdSolRutas",
  tipo: 1,
  red: "simplificada",
  edoOrigen: estadoOrigen,
  ciudadOrigen: ciudadOrigen,
  edoDestino: estadoDestino,
  ciudadDestino: ciudadDestino,
  vehiculos: 9,
  rendimiento: RENDIMIENTO,
  combustible: COMBUSTIBLE,
};

async function main() {
  const url = new URL(ENDPOINT);
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));

  console.log(url);

  const response = await fetch(url);
  const html = await response.text();

  const root = parse(html);

  const table = root.querySelector("#tContenido");
  const trs = table.querySelectorAll(".tr_gris");
  const tr = trs.slice(-3)[0];
  const td = parseFloat(tr.querySelectorAll("td")[4].text.replace(/,/g, ""));
  console.log(td);
  /* const fuelPrice = (DISTANCIA_KILOMETROS / RENDIMIENTO) * COMBUSTIBLE;
  const cost = td + fuelPrice;

  console.log(cost); */
}

main();
