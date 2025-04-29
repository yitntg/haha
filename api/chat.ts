import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = request.body;
    if (!message) {
      return response.status(400).json({ error: 'Message is required' });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!API_KEY) {
      console.error('DEEPSEEK_API_KEY is not set');
      return response.status(500).json({ error: 'API key configuration error' });
    }

    const API_URL = 'https://api.deepseek.com/v1/chat/completions';

    console.log('Sending request to DeepSeek API...');
    const deepseekResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'deepseek-chat',
      }),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('DeepSeek API error:', {
        status: deepseekResponse.status,
        statusText: deepseekResponse.statusText,
        error: errorText
      });
      return response.status(deepseekResponse.status).json({
        error: `DeepSeek API error: ${deepseekResponse.status}`,
        details: errorText
      });
    }

    const data = await deepseekResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 