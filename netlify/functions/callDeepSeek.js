// netlify/functions/callDeepSeek.js
const axios = require('axios');

async function callDeepSeek(message) {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY not found in environment variables');
    }
    
    try {
        console.log(`🤖 Sending to DeepSeek: "${message}"`);
        
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const aiResponse = response.data.choices[0].message.content;
        console.log(`✅ DeepSeek Response:\n${aiResponse}\n`);
        
        return aiResponse;
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = callDeepSeek;
