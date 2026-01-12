interface RepoInsights {
  totalFiles: number;
  hasPackageJson: boolean;
  hasDocker: boolean;
  hasEnvExample: boolean;
  hasReadme: boolean;
  fileNames: string[];
}

interface ParsedRepoSummary {
  projectType: string;
  techStack: string[];
  mainFolders: string[];
  detectedFeatures: string[];
}

/**
 * Analyze repo insights and extract meaningful summary
 */
export function parseRepoInsights(
  insights: RepoInsights
): ParsedRepoSummary {
  const techStack: string[] = [];
  const detectedFeatures: string[] = [];
  const mainFolders = new Set<string>();

  // Extract folder names
  insights.fileNames.forEach((path) => {
    const folder = path.split("/")[0];
    if (folder) mainFolders.add(folder);
  });

  // Tech detection heuristics
  if (insights.fileNames.includes("package.json")) {
    techStack.push("Node.js / JavaScript");
  }

  if (insights.fileNames.some((f) => f.endsWith(".ts"))) {
    techStack.push("TypeScript");
  }

  if (insights.fileNames.some((f) => f.includes("next.config"))) {
    techStack.push("Next.js");
  }

  if (insights.fileNames.some((f) => f.includes("react"))) {
    techStack.push("React");
  }

  if (insights.hasDocker) {
    techStack.push("Docker");
  }

  // Feature detection
  if (insights.fileNames.some((f) => f.includes("auth"))) {
    detectedFeatures.push("Authentication");
  }

  if (insights.fileNames.some((f) => f.includes("payment"))) {
    detectedFeatures.push("Payments");
  }

  if (insights.fileNames.some((f) => f.includes("admin"))) {
    detectedFeatures.push("Admin Panel");
  }

  if (insights.fileNames.some((f) => f.includes("api"))) {
    detectedFeatures.push("API Layer");
  }

  if (insights.hasEnvExample) {
    detectedFeatures.push("Environment Configuration");
  }

  // Project type guess
  let projectType = "General Software Project";

  if (techStack.includes("Next.js")) {
    projectType = "Full Stack Web Application";
  } else if (techStack.includes("React")) {
    projectType = "Frontend Web Application";
  } else if (techStack.includes("Node.js / JavaScript")) {
    projectType = "Backend Service / API";
  }

  return {
    projectType,
    techStack: Array.from(new Set(techStack)),
    mainFolders: Array.from(mainFolders),
    detectedFeatures,
  };
}
