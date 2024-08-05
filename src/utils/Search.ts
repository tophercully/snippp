import { Snippet } from "../typeInterfaces";

function searchAndScoreSnippets(query: string, snippets: Snippet[]): Snippet[] {
  const searchTerms = query.toLowerCase().split(" ");

  return snippets
    .map((snippet) => {
      let score = 0;

      // Apply weights to different fields
      const weights = {
        name: 4,
        tags: 3,
        description: 2,
        code: 1,
      };

      // Search in name (formerly title)
      if (snippet.name) {
        searchTerms.forEach((term) => {
          if (snippet.name.toLowerCase().includes(term)) {
            score += weights.name;
          }
        });
      }

      // Search in tags (now a comma-separated string)
      if (snippet.tags) {
        const tagArray = snippet.tags
          .toLowerCase()
          .split(",")
          .map((tag) => tag.trim());
        tagArray.forEach((tag) => {
          searchTerms.forEach((term) => {
            if (tag.includes(term)) {
              score += weights.tags;
            }
          });
        });
      }

      // Search in description
      if (snippet.description) {
        searchTerms.forEach((term) => {
          if (snippet.description.toLowerCase().includes(term)) {
            score += weights.description;
          }
        });
      }

      // Search in code
      if (snippet.code) {
        searchTerms.forEach((term) => {
          if (snippet.code.toLowerCase().includes(term)) {
            score += weights.code;
          }
        });
      }

      // Boost score based on copy and favorite counts
      if (typeof snippet.copyCount === "number") {
        score += Math.log(snippet.copyCount + 1) * 0.5;
      }
      if (typeof snippet.favoriteCount === "number") {
        score += Math.log(snippet.favoriteCount + 1) * 0.75;
      }

      return { ...snippet, score };
    })
    .filter((snippet) => snippet.score > 0)
    .sort((a, b) => b.score - a.score);
}

export default searchAndScoreSnippets;
