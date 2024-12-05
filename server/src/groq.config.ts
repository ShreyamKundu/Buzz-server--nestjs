import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv?.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
        {
            role: "user",
            content: "Generate a single, catchy, and engaging meme topic or tweet prompt that encourages quick user responses, tailored for an Indian audience. Focus on themes like tech trends, science, random thoughts, funny memes, entertainment, sports, lifestyle choices, pop culture, and current events. Ensure it reflects the latest trends and is easy to react to. Provide only the one-liner without any additional text or quotation marks. Examples: 1. What's the most underrated movie of all time? 2. Just realized how much time I spend scrolling! 3. Messi or Ronaldo? 4. RCB or CSK? 5. Which is better: Marvel or DC?"
        }
    ],
    model: "llama3-8b-8192",
    temperature: 1.2, // High for creativity
    max_tokens: 30, // Keep it very short
    top_p: 1,
    stream: true,
});

  let responseText = '';

  for await (const chunk of chatCompletion) {
    responseText += chunk.choices[0]?.delta?.content || '';
  }

  return responseText; 
}
