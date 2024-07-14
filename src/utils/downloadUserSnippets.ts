import { Snippet } from "../typeInterfaces";

export const exportAndDownloadUserSnippets = (
  fileName: string,
  snippets: Snippet[],
): void => {
  const exportedSnippets = snippets.map((snippet) => ({
    name: snippet.name,
    code: snippet.code,
    description: snippet.description,
    tags: snippet.tags,
    author: snippet.author,
    authorID: snippet.authorID,
    createdAt: snippet.createdAt,
  }));

  const jsonString = JSON.stringify(exportedSnippets, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.json`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
