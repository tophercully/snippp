export interface CategoryInfo {
  name: string;
  tags: string[];
  kind: "language" | "framework/library";
  autoDetected?: boolean; 
}

export type Categories = Record<string, CategoryInfo>;

const categories: Categories = {
  js: {
    name: "JavaScript",
    tags: ["js", "javascript"],
    kind: "language",
  },
  ts: {
    name: "TypeScript",
    tags: ["ts", "typescript"],
    kind: "language",
  },
  reactjs: {
    name: "React JS",
    tags: ["react", "reactjs"],
    kind: "framework/library",
  },
  reactnative: {
    name: "React Native",
    tags: ["react", "reactnative"],
    kind: "framework/library",
  },
  p5: {
    name: "p5.js",
    tags: ["p5", "p5js", "p5.js"],
    kind: "framework/library",
  },
  css: {
    name: "CSS",
    tags: ['css', 'scss', 'sass', 'less', 'stylus'],
    kind: "language",
  },
  three: {
    name: "ThreeJS",
    tags: ["three", "3", "threejs", "three.js"],
    kind: "framework/library",
  },
  python: {
    name: "Python",
    tags: ["python", "py"],
    kind: "language",
  },
  glsl: {
    name: "OpenGL",
    tags: ["opengl", "gl", "shader", "glsl", "webgl"],
    kind: "language",
  },
};

export default categories;
