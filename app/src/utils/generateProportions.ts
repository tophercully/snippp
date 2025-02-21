interface ProportionsConfig {
  count: number;
  minSize: number;
  maxSize: number;
}

function generateProportions({
  count,
  minSize = 5,
  maxSize = 40,
}: ProportionsConfig): number[] {
  if (count < 1) throw new Error("Count must be at least 1");
  if (minSize < 0) throw new Error("Minimum size cannot be negative");
  if (maxSize <= minSize)
    throw new Error("Maximum size must be greater than minimum size");
  if (count * minSize > 100)
    throw new Error("Minimum size is too large for the given count");

  // Initialize array with minimum values and indices
  let proportionsWithIndices = new Array(count)
    .fill(null)
    .map((_, i) => ({ value: minSize, originalIndex: i }));

  let remaining = 100 - minSize * count;

  // Distribute remaining amount randomly
  while (remaining > 0) {
    // Shuffle the array each iteration for more randomness
    proportionsWithIndices = proportionsWithIndices.sort(
      () => Math.random() - 0.5,
    );

    for (let i = 0; i < count && remaining > 0; i++) {
      const space = maxSize - proportionsWithIndices[i].value;
      if (space > 0) {
        const addition = Math.min(Math.random() * space, remaining);
        proportionsWithIndices[i].value += addition;
        remaining -= addition;
      }
    }
  }

  // Shuffle one final time
  proportionsWithIndices = proportionsWithIndices.sort(
    () => Math.random() - 0.5,
  );

  // Round to one decimal place
  return proportionsWithIndices.map((p) => Math.round(p.value * 10) / 10);
}

export default generateProportions;
