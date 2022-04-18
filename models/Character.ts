import Model from "./Model";

class Character extends Model {
  // TODO: helper function can be made for this object to avoid copy/paste in each model
  static mergePolicy = {
    keyArgs: false,
    merge(existing, incoming, options) {
      if (!existing) return incoming;
      return {
        ...incoming,
        results: [...existing.results, ...incoming.results],
      };
    },
  };
}

export default Character;
