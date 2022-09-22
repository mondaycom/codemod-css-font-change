import { Declaration } from "postcss";

export const IMPORT_STATEMENT = null;

export const SELECTOR_PREFIX = "";

export const RULES_TO_INSERT = {
  0: new Declaration({ prop: "font-family", value: "var(--font-family)" }),
  1: new Declaration({ prop: "font-family", value: "var(--title-font-family)" }),
  2: new Declaration({ prop: "font-family", value: "var(--title-font-family)" })
};
