import { NextResponse } from "next/server";
import { buildReadmePrompt } from "@/lib/prompt";
import { generateReadme } from "@/lib/ai";

interface GenerateRequestBody {
  repoName: string;
  repoUrl: string;
  summary: {
    projectType: string;
    techStack: string[];
    mainFolders: string[];
    detectedFeatures: string[];
  };
}

export async function POST(req: Request) {
  try {
    const body: GenerateRequestBody = await req.json();

    if (!body.repoName || !body.repoUrl || !body.summary) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload" },
        { status: 400 }
      );
    }

    // 1️⃣ Build prompt from summary
    const prompt = buildReadmePrompt({
      repoName: body.repoName,
      repoUrl: body.repoUrl,
      summary: body.summary,
    });

    // 2️⃣ Generate README using AI
    const readme = await generateReadme(prompt);

    return NextResponse.json({
      success: true,
      readme,
    });
  } catch (error: any) {
    console.error("Generate API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate README",
      },
      { status: 500 }
    );
  }
}
