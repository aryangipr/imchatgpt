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
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://imchatgpt.netlify.app',
          'X-Title': 'ImChatGPT'
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    res.json({ reply: reply || '❌ No valid reply from OpenRouter' });
  } catch (err) {
    console.error('❌ Backend Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Always bind to process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
