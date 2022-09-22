import { AtRule } from "postcss";

export type State = {
  fontWasAdded: boolean;
  lastUseAtRule: AtRule | null;
};
