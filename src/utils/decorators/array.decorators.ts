export function compareArray(original: number[], update: number[]) {
  const intersect = original.filter((e) => update.includes(e));

  const removeArray = original.filter((el) => {
    return !intersect.includes(el);
  });

  const activeArray = update.filter((el) => {
    return !intersect.includes(el);
  });

  return { removeArray, activeArray };
}
