import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml"; // HTML is part of XML in highlight.js
import python from "highlight.js/lib/languages/python";
import glsl from "highlight.js/lib/languages/glsl";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml); // Register XML as HTML
hljs.registerLanguage("python", python);
hljs.registerLanguage("glsl", glsl);

export const detectLanguage = (code: string): string => {
  const result = hljs.highlightAuto(code);
  return result.language || "plaintext";
};
