import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,   // 🔁 use Groq key
  baseURL: "https://api.groq.com/openai/v1", // 🔁 Groq endpoint
});

/**
 * Generate README using AI via Groq
 */
export async function generateReadme(prompt: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // 🔁 Groq model
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a senior software documentation engineer who writes clean, professional README.md files.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const output = response.choices[0]?.message?.content;

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error: any) {
    console.error("AI Generation Error:", error.message);
    throw new Error("Failed to generate README");
  }
}
