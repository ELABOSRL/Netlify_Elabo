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
    // 🔍 Parse del body che arriva dalla chat
    const payload = JSON.parse(event.body);

    const res = await axios.post(
      "https://cloud.appwrite.io/v1/functions/68b7121a002a6d0a806c/executions", // ID funzione
      JSON.stringify(payload), // ✅ ora mando JSON valido
      {
        headers: {
          "x-appwrite-project": "6889cae000359c469009", // ID progetto
          "x-appwrite-key": process.env.APPWRITE_API_KEY, // 🔑 da Netlify env
          "Content-Type": "application/json"
        }
      }
    );

    // La risposta Appwrite include responseBody come stringa JSON
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(JSON.parse(res.data.responseBody))
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
