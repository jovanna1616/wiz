import { TypePolicy } from "@apollo/client";

abstract class Model {
  static readonly mergeStrategy: TypePolicy;
}

export default Model;
