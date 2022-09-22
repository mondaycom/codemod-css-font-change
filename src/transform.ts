import { IMPORT_STATEMENT, SELECTOR_PREFIX, RULES_TO_INSERT } from "./constants/currentConstants";
import { parse, stringify } from "postcss-scss";
import { Transform } from "css-codemod";
import { AtRule, Declaration, Rule } from "postcss";
import { getRuleFullSelector } from "./utils/getRuleFullSelector";
import { getDeclarationAncestorsArray } from "./utils/getRuleAncestorsArray";
import { combineAtRulesWithRules } from "./utils/combineAtRulesWithRules";
import { calculateFontSizeValue } from "./utils/calculateFontSizeValue";
import { State } from "./types/state";
import { isWhitelistedFile } from "./utils/logical/isWhitelistedFile";

// Define a named `transform` export function.
export const transform: Transform = (fileInfo, api) => {
  if (isWhitelistedFile(fileInfo.path)) {
    return fileInfo.source;
  }

  const root = api.parse(fileInfo.source);

  const state: State = { fontWasAdded: false, lastUseAtRule: null };

  root.walk(node => {
    if (node.type === "atrule" && node.name === "use") {
      state.lastUseAtRule = node;
    }

    if (node.type === "decl" && node.prop === "font-size") {
      const fontSizeValue = calculateFontSizeValue(node.value);
      let ruleToInsert: AtRule | Declaration | undefined;

      if (fontSizeValue <= 16) {
        ruleToInsert = RULES_TO_INSERT[0];
      } else if (fontSizeValue <= 24) {
        ruleToInsert = RULES_TO_INSERT[1];
      } else if (fontSizeValue >= 25) {
        ruleToInsert = RULES_TO_INSERT[2];
      }

      if (ruleToInsert) {
        const declAncestors = getDeclarationAncestorsArray(node);

        if (declAncestors?.every(a => a.type === "rule")) {
          const currentRuleFullSelector = getRuleFullSelector(node.parent as Rule);
          const fontRuleSelector = `${SELECTOR_PREFIX}${currentRuleFullSelector}`;
          const fontRule = new Rule({ selector: fontRuleSelector, nodes: [ruleToInsert] });

          root.append(fontRule);
          state.fontWasAdded = true;
        } else if (declAncestors?.every(a => a.type === "rule" || a.type === "atrule")) {
          const combinedNode = combineAtRulesWithRules(declAncestors, ruleToInsert, SELECTOR_PREFIX);

          if (combinedNode) {
            root.append(combinedNode);
            state.fontWasAdded = true;
          } else {
            console.log("### Error: combinedNode wasn't calculated, declAncestors", declAncestors);
          }
        } else {
          console.log("### Error: unexpected rule ancestors, declAncestors", declAncestors);
        }
      }
    }
  });

  if (state.fontWasAdded && IMPORT_STATEMENT) {
    if (!state.lastUseAtRule) {
      root.prepend(IMPORT_STATEMENT);
    } else {
      // Cause use statement should be at the top of the stylesheet
      root.insertAfter(state.lastUseAtRule, IMPORT_STATEMENT);
    }
  }

  let res = root.toString(stringify);
  if (state.fontWasAdded) {
    // Remove empty lines before include statements
    res = res.replaceAll(/{\n*(?=\s*@include poppins\()/g, "{\n");
    res = res.replaceAll(/{\n*(?=\s*@include manrope\()/g, "{\n");
  }
  return res;
};

// Optionally define a named `parser` export to configure the PostCSS parser.
export const parser = parse;

// Optionally define a named `plugins` export to configure PostCSS plugins.
// export const plugins = [];
