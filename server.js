import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/research', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'Company URL is required.' });
  }

  try {
    const prompt = `Research the company at this URL: ${url}. 
    Provide a comprehensive professional overview including:
    1. Company name and a brief description
    2. Primary products or services offered
    3. Target market or audience
    4. Industry, estimated size, and headquarters location (if available)
    5. Recent news, updates, or milestones
    
    Format the response clearly with clean headings and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error('Error generating research:', error);
    res.status(500).json({ error: error.message || 'Failed to research company.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});