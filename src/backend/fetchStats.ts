// In fetchHomepageInfo.ts
import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface HomepageInfo {
  snippetCount: number;
  userCount: number;
}

export const fetchStats = async (): Promise<HomepageInfo> => {
  const { rows } = await pool.sql`
    SELECT
      (SELECT COUNT(*) FROM Snippets) AS snippetCount,
      (SELECT COUNT(*) FROM snippet_users) AS userCount
  `;

  return {
    snippetCount: parseInt(rows[0].snippetcount),
    userCount: parseInt(rows[0].usercount),
  };
};
