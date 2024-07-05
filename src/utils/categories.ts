export interface CategoryInfo {
  name: string;
  tags: string[];
}

export type Categories = Record<string, CategoryInfo>;

const categories: { [key: string]: CategoryInfo } = {
  js: {
    name: "JavaScript",
    tags: ["js", "javascript"],
  },
  ts: {
    name: "TypeScript",
    tags: ["ts", "typescript"],
  },
  reactjs: {
    name: "React JS",
    tags: ["react", "reactjs"],
  },
  reactnative: {
    name: "React Native",
    tags: ["react", "reactnative"],
  },
  p5: {
    name: "p5.js",
    tags: ["p5", "p5js", "p5.js"],
  },
  three: {
    name: "ThreeJS",
    tags: ["three", "3", "threejs", "three.js"],
  },
  python: {
    name: "Python",
    tags: ["python", "py"],
  },
  glsl: {
    name: "OpenGL",
    tags: ["opengl", "gl", "shader", "glsl", "webgl"],
  },
};

export default categories;
