import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generate README using AI
 */
export async function generateReadme(prompt: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
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
