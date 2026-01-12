import { NextResponse } from "next/server";

import { parseRepoUrl, extractRepoInsights } from "@/lib/github";
import { parseRepoInsights } from "@/lib/parser";
import { buildReadmePrompt } from "@/lib/prompt";
import { generateReadme } from "@/lib/ai";

interface AnalyzeRequestBody {
  repos: string[];
}

export async function POST(req: Request) {
  try {
    const body: AnalyzeRequestBody = await req.json();

    if (!body.repos || !Array.isArray(body.repos) || body.repos.length === 0) {
      return NextResponse.json(
        { success: false, message: "Repos array is required" },
        { status: 400 }
      );
    }

    const results = [];

    for (const repoUrl of body.repos) {
      try {
        // 1️⃣ Parse repo URL
        const { owner, repo } = parseRepoUrl(repoUrl);

        // 2️⃣ Fetch repo insights from GitHub
        const insights = await extractRepoInsights(owner, repo);

        // 3️⃣ Convert raw insights → structured summary
        const summary = parseRepoInsights(insights);

        // 4️⃣ Build AI prompt
        const prompt = buildReadmePrompt({
          repoName: repo,
          repoUrl,
          summary,
        });

        // 5️⃣ Generate README using AI
        const readme = await generateReadme(prompt);

        results.push({
          repo: repoUrl,
          success: true,
          summary,
          readme,
        });
      } catch (repoError: any) {
        console.error(`Repo failed: ${repoUrl}`, repoError.message);

        results.push({
          repo: repoUrl,
          success: false,
          error: repoError.message || "Failed to analyze repo",
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Analyze API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
