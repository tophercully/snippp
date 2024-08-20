import { Snippet } from "../typeInterfaces";

function searchAndScoreSnippets(query: string, snippets: Snippet[]): Snippet[] {
  const searchTerms = query.toLowerCase().split(" ");

  const scoredSnippets = snippets
    .map((snippet) => {
      let relevanceScore = 0;

      // Apply weights to different fields
      const weights = {
        name: 4,
        tags: 3,
        description: 2,
        code: 1,
        author: 3,
      };

      // Helper function to calculate some field score
      const calculateFieldScore = (content: string, weight: number) => {
        let fieldScore = 0;
        searchTerms.forEach((term) => {
          if (content.toLowerCase().includes(term)) {
            fieldScore += weight;
          }
        });
        // Cap the field score at 2 times the weight
        return Math.min(fieldScore, weight * 2);
      };

      // Search in name
      if (snippet.name) {
        relevanceScore += calculateFieldScore(snippet.name, weights.name);
      }

      // Search in author
      if (snippet.author) {
        relevanceScore += calculateFieldScore(snippet.author, weights.author);
      }

      // Search in tags
      if (snippet.tags) {
        const tagString = snippet.tags.toLowerCase();
        relevanceScore += calculateFieldScore(tagString, weights.tags);
      }

      // Search in description
      if (snippet.description) {
        relevanceScore += calculateFieldScore(
          snippet.description,
          weights.description,
        );
      }

      // Search in code
      if (snippet.code) {
        relevanceScore += calculateFieldScore(snippet.code, weights.code);
      }

      // Calculate popularity score
      const copyCount = snippet.copyCount || 0;
      const favoriteCount = snippet.favoriteCount || 0;
      const popularityScore = Math.log(copyCount + favoriteCount + 1);

      // Combine relevance and popularity scores
      const combinedScore = relevanceScore * 1.5 + popularityScore;

      return { ...snippet, relevanceScore, popularityScore, combinedScore };
    })
    .filter((snippet) => snippet.relevanceScore > 0);

  // Sort by combined score
  scoredSnippets.sort((a, b) => b.combinedScore - a.combinedScore);

  return scoredSnippets;
}

export default searchAndScoreSnippets;
