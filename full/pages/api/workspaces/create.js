// pages/api/workspaces/create.js

import { getToken } from "next-auth/jwt";
import { query } from "../../../lib/db";
import { checkRepoExists } from "../../../lib/mcp";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = await getToken({ req });
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { workspaceName, repoUrl } = req.body;

  const userEmail = token.email;
  const userResult = await query("SELECT id FROM users WHERE email = $1", [userEmail]);
  const userId = userResult.rows[0]?.id;

  if (!userId) return res.status(404).json({ error: "User not found" });

  // Validate repo via MCP
  const { success, data } = await checkRepoExists(repoUrl);
  if (!success || !data.valid) {
    return res.status(400).json({ error: "Invalid GitHub repository" });
  }

  try {
    const result = await query(
      "INSERT INTO workspaces (user_id, workspace_name, repo_url) VALUES ($1, $2, $3) RETURNING *",
      [userId, workspaceName, repoUrl]
    );

    res.status(201).json({ workspace: result.rows[0], structure: data.structure });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
}
