import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

const categories = {
  js: {
    name: "JavaScript",
    tags: ["js", "javascript"],
    type: "language",
  },
  ts: {
    name: "TypeScript",
    tags: ["ts", "typescript"],
    type: "language",
  },
  reactjs: {
    name: "React JS",
    tags: ["react", "reactjs"],
    type: "framework",
  },
  reactnative: {
    name: "React Native",
    tags: ["react", "reactnative"],
    type: "framework",
  },
  p5: {
    name: "p5.js",
    tags: ["p5", "p5js", "p5.js"],
    type: "framework",
  },
  css: {
    name: "CSS",
    tags: ["css", "scss", "sass", "less", "stylus"],
    type: "language",
  },
  three: {
    name: "ThreeJS",
    tags: ["three", "3", "threejs", "three.js"],
    type: "framework",
  },
  python: {
    name: "Python",
    tags: ["python", "py"],
    type: "language",
  },
  glsl: {
    name: "OpenGL",
    tags: ["opengl", "gl", "shader", "glsl", "webgl"],
    type: "language",
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { rows } = await pool.sql`
        WITH UserSnippets AS (
          SELECT snippetID, LENGTH(code) AS code_length, copyCount, tags
          FROM snippets
          WHERE authorID = ${userId}
        ),
        FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          WHERE snippetID IN (SELECT snippetID FROM UserSnippets)
          GROUP BY snippetID
        )
        SELECT 
          COUNT(*) AS total_snippets,
          COALESCE(SUM(us.code_length), 0) AS total_snippet_length,
          COALESCE(SUM(us.copyCount), 0) AS total_copies,
          COALESCE(SUM(fc.favoriteCount), 0) AS total_favorites,
          json_agg(us.tags) AS snippet_tags
        FROM UserSnippets us
        LEFT JOIN FavoriteCounts fc ON us.snippetID = fc.snippetID
      `;

    if (rows.length === 0 || rows[0].total_snippets === 0) {
      return res.status(404).json({ error: "No snippets found for this user" });
    }

    const userStats = rows[0];
    const snippetTags = userStats.snippet_tags || [];

    const languageDistribution: { [key: string]: number } = {};
    const frameworkDistribution: { [key: string]: number } = {};

    snippetTags.forEach((tags: string) => {
      if (typeof tags === "string") {
        const tagsArray = tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase());

        Object.entries(categories).forEach(([key, category]) => {
          if (
            category.tags.some((tag) => tagsArray.includes(tag.toLowerCase()))
          ) {
            if (category.type === "language") {
              languageDistribution[key] = (languageDistribution[key] || 0) + 1;
            } else if (category.type === "framework") {
              frameworkDistribution[key] =
                (frameworkDistribution[key] || 0) + 1;
            }
          }
        });
      }
    });

    const stats = {
      totalSnippets: parseInt(userStats.total_snippets),
      totalSnippetLength: parseInt(userStats.total_snippet_length),
      totalSnippetCopies: parseInt(userStats.total_copies),
      totalFavorites: parseInt(userStats.total_favorites),
      languageDistribution,
      frameworkDistribution,
    };

    res.status(200).json(stats);
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
      stack: error.stack,
    });
  }
}
