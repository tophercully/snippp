import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

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
  svelte: {
    name: "Svelte",
    tags: ["svelte", "sveltekit"],
    type: "framework",
  },
  vue: {
    name: "Vue",
    tags: ["vue", "vuejs"],
    type: "framework",
  },
  angular: {
    name: "Angular",
    tags: ["ang", "angular"],
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

interface ExtendedHomepageInfo {
  totalUsers: number;
  totalSnippets: number;
  totalLists: number;
  averageUserSnippets: number;
  totalSnippetCopies: number;
  activeUsers: number;
  totalSnippetLength: number;
  languageDistribution: { [key: string]: number };
  frameworkDistribution: { [key: string]: number };
}

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const result = await sql`
      WITH user_snippets AS (
        SELECT authorid, COUNT(*) AS snippet_count
        FROM snippets
        GROUP BY authorid
      ),
      active_users AS (
        SELECT COUNT(DISTINCT authorid) AS count
        FROM snippets
        WHERE createdat > NOW() - INTERVAL '30 days'
      )
      SELECT
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM snippets) AS totalSnippets,
        (SELECT COUNT(*) FROM snippet_lists) AS totalLists,
        (SELECT COALESCE(AVG(snippet_count), 0) FROM user_snippets) AS averageUserSnippets,
        (SELECT COALESCE(SUM(copycount), 0) FROM snippets) AS totalSnippetCopies,
        (SELECT count FROM active_users) AS activeUsers,
        (SELECT COALESCE(SUM(LENGTH(code)), 0) FROM snippets) AS totalSnippetLength,
        (SELECT json_agg(json_build_object('id', snippetid, 'tags', tags)) FROM snippets) AS snippetTags
    `;

    const snippetTags = result[0].snippettags || [];

    const languageDistribution: { [key: string]: number } = {};
    const frameworkDistribution: { [key: string]: number } = {};

    snippetTags.forEach((snippet: { id: number; tags: string }) => {
      const snippetTagsArray = snippet.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      Object.entries(categories).forEach(([key, category]) => {
        if (
          category.tags.some((tag) =>
            snippetTagsArray.includes(tag.toLowerCase()),
          )
        ) {
          if (category.type === "language") {
            languageDistribution[key] = (languageDistribution[key] || 0) + 1;
          } else if (category.type === "framework") {
            frameworkDistribution[key] = (frameworkDistribution[key] || 0) + 1;
          }
        }
      });
    });

    const stats: ExtendedHomepageInfo = {
      totalUsers: parseInt(result[0].totalusers),
      totalSnippets: parseInt(result[0].totalsnippets),
      totalLists: parseInt(result[0].totallists),
      averageUserSnippets: parseFloat(result[0].averageusersnippets),
      totalSnippetCopies: parseInt(result[0].totalsnippetcopies),
      activeUsers: parseInt(result[0].activeusers),
      totalSnippetLength: parseInt(result[0].totalsnippetlength),
      languageDistribution,
      frameworkDistribution,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
