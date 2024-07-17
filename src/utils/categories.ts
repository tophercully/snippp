export interface CategoryInfo {
  name: string;
  tags: string[];
  type: "language" | "framework";
  autoDetected?: boolean;
  urlPath?: string;
}

export type Categories = Record<string, Omit<CategoryInfo, "urlPath">>;

const categories: Categories = {
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
  Angular: {
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

export default categories;
