const axios = require("axios");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Credentials": "true"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Metodo non consentito"
    };
  }

  try {
    // 🔍 Parse del body ricevuto dal frontend (stringa → oggetto)
    const payload = JSON.parse(event.body);

    // ✅ Wrappo nel formato che Appwrite si aspetta
    const res = await axios.post(
      "https://cloud.appwrite.io/v1/functions/68b7121a002a6d0a806c/executions", // ID funzione
      {
        body: JSON.stringify(payload) // <-- deve stare in `body` come stringa
      },
      {
        headers: {
          "x-appwrite-project": "6889cae000359c469009", // ID progetto
          "x-appwrite-key": process.env.APPWRITE_API_KEY, // 🔑 da Netlify env
          "Content-Type": "application/json"
        }
      }
    );

    // 🔍 Estraggo la risposta dal campo `responseBody` di Appwrite
    let parsedBody;
    try {
      parsedBody = JSON.parse(res.data.responseBody); // JSON valido
    } catch {
      parsedBody = { raw: res.data.responseBody }; // fallback
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsedBody)
    };
  } catch (error) {
    console.error("❌ Errore proxy:", error.message);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
