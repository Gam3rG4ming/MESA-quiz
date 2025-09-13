const express = require('express');
const serverless = require('serverless-http');
const app = express();
const callDeepSeek = require('./callDeepSeek'); // Ensure this is correctly imported
app.use(express.json());
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const response = await callDeepSeek(message);
        res.json({
            success: true,
            response: response
        });
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({
            error: 'Failed to get response from DeepSeek API',
            details: error.message
        });
    }
});
exports.handler = serverless(app);
