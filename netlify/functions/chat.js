// netlify/functions/chat.js
const axios = require('axios');

async function callDeepSeek(message) {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY not found in environment variables');
    }
    
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: message }],
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error calling DeepSeek:', error.response?.data || error.message);
        throw error;
    }
}

// The main handler for the Netlify Function
exports.handler = async function(event, context) {
    try {
        const { message } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        const response = await callDeepSeek(message);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, response: response })
        };
    } catch (error) {
        console.error('API Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to get response from DeepSeek API',
                details: error.message
            })
        };
    }
};
