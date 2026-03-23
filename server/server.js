import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.KAPA_API_KEY;
const PROJECT_ID = process.env.KAPA_PROJECT_ID;
const API_URL = process.env.KAPA_API_URL || 'https://api.kapa.ai';
const PORT = parseInt(process.env.PORT || '3456', 10);

if (!API_KEY || API_KEY === 'your-api-key') {
  console.error('Set KAPA_API_KEY in .env.local');
  process.exit(1);
}

if (!PROJECT_ID || PROJECT_ID === 'your-project-id') {
  console.error('Set KAPA_PROJECT_ID in .env.local');
  process.exit(1);
}

const ALLOWED_ORIGINS = [
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.post('/api/session', async (_req, res) => {
  try {
    const response = await fetch(
      `${API_URL}/agent/v1/projects/${PROJECT_ID}/agent/sessions/`,
      {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Kapa API error: ${response.status}`,
      });
    }

    res.json(await response.json());
  } catch (err) {
    console.error('Failed to create session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.listen(PORT, () => {
  console.log(`Session server running on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/session`);
});
