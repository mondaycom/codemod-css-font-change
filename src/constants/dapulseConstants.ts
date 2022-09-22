import { AtRule } from "postcss";

export const IMPORT_STATEMENT = new AtRule({
  name: "import",
  params: '"app/assets/stylesheets/pulse/default/_mixins.scss"'
});

export const SELECTOR_PREFIX = "#main.global-brand-font ";

export const RULES_TO_INSERT = {
  0: new AtRule({ name: "include", params: "manrope()" }),
  1: new AtRule({ name: "include", params: `poppins(0.2px)` }),
  2: new AtRule({ name: "include", params: `poppins(0.4px)` })
};
