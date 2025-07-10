require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    res.json({ reply: reply || '❌ Sorry, no valid response' });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Failed to get response from OpenRouter' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
