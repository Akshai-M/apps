// lib/mcp.js

export async function checkRepoExists(repoUrl) {
    const MCP_BASE_URL = process.env.MCP_API_URL;
  
    try {
      const response = await fetch(`${MCP_BASE_URL}/validate-repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
  
      const data = await response.json();
      return { success: response.ok, data };
    } catch (err) {
      console.error("MCP repo check failed:", err);
      return { success: false, error: "MCP connection failed" };
    }
  }
  