import { TypePolicy } from "@apollo/client";

abstract class Model {
  static readonly rootQueryKey: string;
  static readonly rootQueryTypePolicy: TypePolicy;
}

export default Model;
