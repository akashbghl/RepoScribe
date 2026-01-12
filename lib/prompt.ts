export function buildReadmePrompt({
  repoName,
  repoUrl,
  summary,
}:any): string {
  return `
You are a senior software engineer and an expert technical writer who creates high-quality, real-world GitHub README files.

Generate a clean, visually appealing, and professional README.md in pure Markdown format.

Project Information:
- Project Name: ${repoName}
- Repository URL: ${repoUrl}
- Project Type: ${summary.projectType}
- Tech Stack: ${summary.techStack.join(", ") || "Not detected"}
- Main Folders: ${summary.mainFolders.join(", ") || "N/A"}
- Detected Features: ${summary.detectedFeatures.join(", ") || "N/A"}

README must include:

1. 🧠 Project Overview  
   - Clear explanation of what the project does  
   - What problem it solves or value it provides  
   - High-level architecture or flow (if relevant)

2. 🚀 Key Features  
   - Bullet points  
   - Short explanation for important features  

3. 🛠️ Tech Stack  
   - Categorized list if possible (Frontend, Backend, Tools, etc.)

4. 📂 Project Structure  
   - Explain important folders based on detected structure  

5. ⚙️ Installation & Setup  
   - Prerequisites  
   - Installation steps  
   - Environment variables example  

6. ▶️ Running the Project  
   - How to start locally  

7. 🌱 Future Improvements  
   - Realistic enhancement ideas  

8. 🤝 Contribution Guidelines  

9. 📝 License  

Rules:
- Use professional but friendly tone
- Make it visually attractive using emojis moderately
- Use proper markdown headings (#, ##, ###)
- Do not hallucinate APIs, services, or libraries
- If something is unknown, clearly state assumptions
- Keep commands realistic (npm/yarn only if Node detected)
- Avoid unnecessary verbosity
- Output only valid Markdown content
- Do NOT wrap output inside code blocks

Bonus:
- Add one short single-line credit at the very bottom:
  "This README was generated using an AI-powered tool."

`;
}
