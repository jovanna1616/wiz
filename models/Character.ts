import { paginatedMergeStrategy } from "../utils";
import Model from "./Model";

class Character extends Model {
  static rootQueryKey = "characters";

  static rootQueryTypePolicy = {
    keyArgs: false,
    merge: paginatedMergeStrategy,
  };
}

export default Character;
