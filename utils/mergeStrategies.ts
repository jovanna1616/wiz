export const paginatedMergeStrategy = (existing, incoming, options) => {
  if (!existing) return incoming;
  return {
    ...incoming,
    results: [...existing.results, ...incoming.results],
  };
};
