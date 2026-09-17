// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Hanya menerima method POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    // Mengambil API Key dari Environment Variable Netlify
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};