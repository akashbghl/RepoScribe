import axios from "axios";

/**
 * Extract owner and repo name from GitHub URL
 */
export function parseRepoUrl(repoUrl: string) {
  try {
    const url = new URL(repoUrl);
    const [owner, repo] = url.pathname.replace("/", "").split("/");

    if (!owner || !repo) throw new Error("Invalid GitHub repo URL");

    return { owner, repo };
  } catch {
    throw new Error("Invalid GitHub URL format");
  }
}

/**
 * Axios instance with GitHub headers
 */
const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

/**
 * Fetch root repository files
 */
export async function getRepoContents(owner: string, repo: string) {
  const res = await githubApi.get(`/repos/${owner}/${repo}/contents`);
  return res.data;
}

/**
 * Fetch any file content from GitHub (base64 decode)
 */
export async function getFileContent(downloadUrl: string) {
  const res = await axios.get(downloadUrl);
  return res.data;
}

/**
 * Recursively scan repository tree (depth limited)
 */
export async function scanRepoTree(
  owner: string,
  repo: string,
  path = "",
  depth = 2
): Promise<any[]> {
  if (depth === 0) return [];

  const res = await githubApi.get(
    `/repos/${owner}/${repo}/contents/${path}`
  );

  const items = res.data;

  let files: any[] = [];

  for (const item of items) {
    files.push(item);

    if (item.type === "dir") {
      const nested = await scanRepoTree(
        owner,
        repo,
        item.path,
        depth - 1
      );
      files = files.concat(nested);
    }
  }

  return files;
}

/**
 * Extract useful project signals
 */
export async function extractRepoInsights(owner: string, repo: string) {
  const tree = await scanRepoTree(owner, repo);

  const fileNames = tree.map((f) => f.path);

  const hasPackageJson = fileNames.includes("package.json");
  const hasDocker = fileNames.includes("Dockerfile");
  const hasEnvExample = fileNames.some((f) =>
    f.includes(".env.example")
  );
  const hasReadme = fileNames.some((f) =>
    f.toLowerCase().includes("readme")
  );

  return {
    totalFiles: tree.length,
    hasPackageJson,
    hasDocker,
    hasEnvExample,
    hasReadme,
    fileNames,
  };
}
