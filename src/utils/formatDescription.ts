export const formatDescription = (text: string): string => {
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const convertLinksToAnchors = (line: string): string => {
    return line.replace(urlRegex, (url) => {
      const displayText = url.replace(/^https?:\/\//, "");
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">${displayText}</a>`;
    });
  };

  return text.split("\n").map(convertLinksToAnchors).join("<br>");
};
