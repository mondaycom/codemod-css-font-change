import { Rule } from "postcss";

export const getRuleRootParent = (rule: Rule): Rule | undefined => {
  const parentType = rule.parent?.type;
  if (parentType === "rule") {
    return getRuleRootParent(rule.parent as Rule);
  }
  if (parentType === "root") {
    return rule;
  }
  return undefined;
};
