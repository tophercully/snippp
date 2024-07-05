import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import "highlight.js/styles/xcode.css";

type ThemeType = "monokai" | "xcode";

interface CodeHighlightProps {
  code: string;
  theme?: ThemeType;
  language?: string;
}

const CodeBlock: React.FC<CodeHighlightProps> = ({
  code,
  theme = "monokai",
  language,
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.className = `hljs ${theme} bg-transparent`;
      if (language) {
        hljs.highlightElement(codeRef.current);
      } else {
        const result = hljs.highlightAuto(code);
        codeRef.current.innerHTML = result.value;
        codeRef.current.classList.add(result.language as string);
      }
    }
  }, [code, theme, language]);

  const themeClasses = {
    monokai: "text-gray-100",
    xcode: "text-gray-900",
  };

  return (
    <pre
      className={`overflow-auto rounded-lg bg-transparent p-4 ${themeClasses[theme]}`}
    >
      <code
        ref={codeRef}
        className="bg-transparent"
      >
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
