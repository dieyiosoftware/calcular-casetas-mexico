const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

// Obtener apiKey de aqui http://gaia.inegi.org.mx/sakbe_v3.1/genera_token.jsp
// API docs https://www.inegi.org.mx/servicios/Ruteo/Default.html
const apiKey = "skJZIVXq-qJfc-hyJT-hd4X-VFNfKBIsqkOc";
const baseUrl = "https://gaia.inegi.org.mx/sakbe_v3.1";

const getDestinationIdByKeyword = async (value) => {
  let destinationId;

  const params = new URLSearchParams();
  params.append("buscar", value);
  params.append("type", "json");
  params.append("num", 1);
  params.append("key", apiKey);

  try {
    const response = await fetch(`${baseUrl}/buscadestino`, {
      method: "POST",
      body: params,
    });
    const { data } = await response.json();
    const [destination] = data;

    if (destination && destination.id_dest) {
      destinationId = destination.id_dest;
    }
  } catch (error) {
    throw new Error(
      `Something went wrong while fetching destination: ${error}`
    );
  }

  return destinationId;
};

const getTollboothPrice = async (sourceId, targetId, axles, surplusAxles) => {
  let boothPrice = 0;

  const vehicleTypes = {
    2: 5,
    3: 6,
    4: 7,
    5: 8,
    6: 9,
    7: 10,
    8: 11,
    9: 12,
  };

  const params = new URLSearchParams();
  params.append("dest_i", sourceId);
  params.append("dest_f", targetId);
  params.append("v", vehicleTypes[axles]);
  params.append("e", surplusAxles || 0);
  params.append("type", "json");
  params.append("key", apiKey);

  try {
    const response = await fetch(`${baseUrl}/cuota`, {
      method: "POST",
      body: params,
    });
    const { data } = await response.json();

    if (data && data.costo_caseta) {
      boothPrice = data.costo_caseta;
    }
  } catch (error) {
    throw new Error(`Something went wrong while fetching tollbooth: ${error}`);
  }

  return boothPrice;
};

module.exports = {
  getTollboothPrice,
  getDestinationIdByKeyword,
};

async function main() {
  const first = await getTollboothPrice(34224, 30566, 2, 2);
  const second = await getDestinationIdByKeyword(
    "Av Moctezuma 1596, Cd del Sol, 45050 Guadalajara, Jal., Mexico"
  );

  console.log(first, second);
}

main();
