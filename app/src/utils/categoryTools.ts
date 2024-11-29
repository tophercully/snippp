import { categories, CategoryInfo } from "../data/categories";


export const getCategoriesFromTags = (tagsString: string): string[] => {
  // Normalize and split the tags
  const snippetTags = tagsString
    .toLowerCase()
    .split(",")
    .map((tag) => tag.trim());

  // Filter and map categories based on matching tags
  const matchedCategories = Object.entries(categories)
    .filter(([, categoryInfo]) =>
      categoryInfo.tags.some((catTag) => snippetTags.includes(catTag)),
    )
    .map(([categoryKey]) => categoryKey);

  return matchedCategories;
};

export const categorizeLanguage = (detectedLang: string): string => {
  const categoriesMap: { [key: string]: string[] } = {
    js: ["javascript", "js", "jsx", "node"],
    ts: ["typescript", "ts", "tsx"],
    glsl: ["glsl", "opengl", "webgl"],
    html: ["html", "xml", "svg", "markup"],
    css: ["css", "scss", "sass", "less", "stylus"],
    python: ["python", "py", "gyp"],
  };

  const normalizedLang = detectedLang ? detectedLang.toLowerCase() : "";

  for (const [category, langs] of Object.entries(categoriesMap)) {
    if (langs.includes(normalizedLang)) {
      return category;
    }
  }

  return "unknown";
};

export const determineCategories = (
  tagsString: string,
  detectedLang: string,
): CategoryInfo[] => {
  const snippetTags = tagsString
    .toLowerCase()
    .split(",")
    .map((tag) => tag.trim());

  const matchedCategories = Object.entries(categories)
    .filter(([, categoryInfo]) =>
      categoryInfo.tags.some((catTag) => snippetTags.includes(catTag)),
    )
    .map(([, categoryInfo]) => ({ ...categoryInfo, autoDetected: false }));

  const hasLanguageTag = matchedCategories.some(
    (category) => category.type === "language",
  );

  if (!hasLanguageTag) {
    const languageCategory = categorizeLanguage(detectedLang);
    if (languageCategory !== "unknown" && languageCategory in categories) {
      matchedCategories.push({
        ...categories[languageCategory],
        autoDetected: true,
      });
    }
  }

  return matchedCategories;
};
