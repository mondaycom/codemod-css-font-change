import { Rule } from "postcss";

/**
 * Combines full flat rule selector going up by parent chain till atRule or root are met
 * @param rule
 */
export const getRuleFullSelector = (rule: Rule): string | undefined => {
  const selector: string | undefined = rule?.selector;
  if (!selector) {
    return undefined;
  }

  const parentType = rule.parent?.type;
  if (parentType === "root" || parentType === "atrule") {
    return selector;
  }
  if (parentType === "rule") {
    const parentSelector = getRuleFullSelector(rule.parent as Rule);
    if (!selector.includes("&")) {
      if (selector.includes(", ")) {
        const selectorParts = selector.split(", ").map(sp => `${parentSelector} ${sp}`);
        return selectorParts.join(", ");
      } else {
        return `${parentSelector} ${selector}`;
      }
    } else {
      if (selector.includes(", ")) {
        const selectorParts = selector.split(", ").map(sp => `${parentSelector}${sp.replaceAll("&", "")}`);
        return selectorParts.join(", ");
      } else {
        return `${parentSelector}${selector.replaceAll("&", "")}`;
      }
    }
  }

  return undefined;
};
