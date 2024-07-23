export const formatDescription = (text: string): string => {
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;

  const convertLinksToAnchors = (line: string): string => {
    return line.replace(urlRegex, (url) => {
      const displayText = url.replace(/^https?:\/\//, "");
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">${displayText}</a>`;
    });
  };

  const getLanguageTitle = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      js: "JavaScript",
      ts: "TypeScript",
      py: "Python",
      html: "HTML",
      css: "CSS",
      java: "Java",
      cpp: "C++",
      cs: "C#",
      go: "Go",
      rust: "Rust",
    };
    return languageMap[lang.toLowerCase()] || "Code";
  };

  const formatCodeBlocks = (content: string): string => {
    return content.replace(
      codeBlockRegex,
      (_, lang: string | undefined, code: string) => {
        const languageTitle = lang ? getLanguageTitle(lang) : "Code";
        const trimmedCode = code
          .trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Remove common leading whitespace from all lines
        const lines = trimmedCode.split("\n");
        const commonIndent = lines.reduce((min, line) => {
          const indentMatch = line.match(/^\s*/);
          const indent = indentMatch ? indentMatch[0].length : 0;
          return line.trim().length > 0 ? Math.min(min, indent) : min;
        }, Infinity);

        const dedentedCode = lines
          .map((line) => line.slice(commonIndent))
          .join("\n");

        return `<div class="my-4">
    <div class="text-sm font-bold -mb-4">${languageTitle}</div>
    <pre class="bg-base-150 dark:bg-base-800 rounded-lg p-4 overflow-x-auto"><code class="font-mono text-sm text-base-800 dark:text-base-200">${dedentedCode}</code></pre>
  </div>`;
      },
    );
  };

  const formattedText = formatCodeBlocks(text);
  return formattedText.split("\n").map(convertLinksToAnchors).join("<br>");
};
