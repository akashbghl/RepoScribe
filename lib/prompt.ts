interface ParsedRepoSummary {
  projectType: string;
  techStack: string[];
  mainFolders: string[];
  detectedFeatures: string[];
}

interface PromptInput {
  repoName: string;
  repoUrl: string;
  summary: ParsedRepoSummary;
}

/**
 * Build a structured AI prompt for README generation
 */
export function buildReadmePrompt({
  repoName,
  repoUrl,
  summary,
}: PromptInput): string {
  return `
You are a senior software engineer and technical writer.

Generate a clean, professional README.md in Markdown format.

Project Information:
- Project Name: ${repoName}
- Repository URL: ${repoUrl}
- Project Type: ${summary.projectType}
- Tech Stack: ${summary.techStack.join(", ") || "Not detected"}
- Main Folders: ${summary.mainFolders.join(", ") || "N/A"}
- Detected Features: ${summary.detectedFeatures.join(", ") || "N/A"}

README must include:

1. Project Overview (clear and concise)
2. Key Features (bullet points)
3. Tech Stack
4. Project Structure (folder explanation)
5. Installation & Setup
6. Environment Variables (example)
7. Running the Project
8. Future Improvements
9. Contribution Guidelines
10. License section

Rules:
- Use professional tone
- Use proper markdown headings
- Avoid emojis
- Keep instructions realistic
- Do not hallucinate external services
- Assume developer audience
- Output only Markdown content
`;
}
