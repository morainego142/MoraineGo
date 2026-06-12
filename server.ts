import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

app.use(express.json());

// API endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages body' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        output: "Welcome! The Moraine Go AI Concierge is currently running in offline preview mode (Gemini Key not configured). You can still use our booking portal above to calculate your fares and secure your tickets instantly!"
      });
    }

    const systemPrompt = `You are the Moraine Go Rockies AI Concierge, a friendly and informative virtual travel advisor for Moraine Go Shuttle & Tours in Banff National Park.
Your duty is to answer questions about:
1. Moraine Go's premium round-trip transport services connecting Banff Town, Lake Louise, and Moraine Lake.
2. Banff, Lake Louise and Moraine Lake travel logistics (e.g. personal cars are prohibited on Moraine Lake road, reservation is crucial!).
3. Parks Canada rules, park passes, local shuttles, and visitor tips.
4. Top attractions like Sentinel Pass, Larch Valley, Lake Constance, Lake Agnes Teahouse, and the Plain of Six Glaciers.
5. Best times for photo opportunities, golden hour peaks (Valley of the Ten Peaks), hiking equipment lists, and bear safety tips.

Pricing Guidelines:
- Banff to Lake Louise & Moraine Lake Round-Trip: $105 CAD per seat. This is a curated same-day 4.5-hour double lake excursion with departure and return scheduled automatically.
- Departure Schedule slots: 07:00 AM, 08:00 AM, 09:00 AM, 01:00 PM, and 02:00 PM (each automatically secures the same-day return exactly 4.5 hours later).
- Children under 5 ride free (but must be requested for safety seating constraints).

Always stay warm, professional, and clear. Suggest users book their shuttles using the interactive reservation widget on our webpage. Keep answers concise. Use markdown list formatting for readability.`;

    const chatHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ output: response.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message || 'Error communicating with Gemini model' });
  }
});

// Setup Vite development server or production environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Moraine Go Shuttle application running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((e) => {
  console.error("Failed to start server", e);
});
