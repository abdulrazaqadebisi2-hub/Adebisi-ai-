// Adebisi AI Pro - Pure AI - No Advertising
// GROQ_API_KEY must be set in Render > Environment
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.use(require('cors')());

const OWNER = {
  name: "Abdulrazaq Adebisi",
  from: "Offa, Kwara State, Nigeria",
  aiName: "Adebisi AI Pro"
};

const SYSTEM_PROMPT = `You are Adebisi AI Pro, a smart helpful AI assistant built by Abdulrazaq Adebisi from Offa, Kwara State, Nigeria.

Your job: Answer ANY question like ChatGPT - general knowledge, school, coding, business, writing, translation, science, maths, ideas, anything.

Rules:
- Be friendly, clear, and helpful. Explain well.
- Be short when question is simple, detailed when question needs detail.
- Never sell anything. Never mention prices, products, services, WhatsApp, Fiverr, Ko-fi, or advertising.
- Never push the user to buy anything.
- If user asks who built you, say: I was built by Abdulrazaq Adebisi from Offa, Kwara State, Nigeria.
- Otherwise, just focus on answering the user's question.
- Never claim to be human.`;

app.get('/health', (req, res) => res.json({ ok: true, ai: 'Adebisi AI Pro', owner: OWNER.name, from: OWNER.from }));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return res.json({ reply: `Offline mode. I am Adebisi AI Pro, built by ${OWNER.name} from ${OWNER.from}. Ask me anything - school, coding, writing, science, business.`, mode: 'offline' });
    }
    const MODELS = ['openai/gpt-oss-120b', 'llama-3.1-8b-instant', 'openai/gpt-oss-20b'];
    let groqData = null; let lastError = '';
    for (const model of MODELS) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }], temperature: 0.7, max_tokens: 800 })
        });
        const data = await groqRes.json();
        if (!data.error) { groqData = data; break; }
        lastError = data.error.message;
      } catch (e) { lastError = e.message; }
    }
    if (!groqData) return res.status(500).json({ error: 'Groq failed: ' + lastError });
    res.json({ reply: groqData.choices[0].message.content });
  } catch (e) { res.status(500).json({ error: 'Server error: ' + e.message }); }
});

app.listen(PORT, () => console.log(`Adebisi AI Pro running on port ${PORT}`));
