import { AtRule, Container, Declaration, Rule } from "postcss";

/**
 * Return array of rule's ancestors till root
 */
export const getDeclarationAncestorsArray = (declaration: Declaration): (Rule | AtRule | Container)[] | undefined => {
  const ancestors: (Rule | AtRule | Container)[] = [];
  let currentRule: Rule | AtRule | Container | undefined = declaration.parent;
  while (currentRule && currentRule.type !== "root") {
    ancestors.push(currentRule);
    currentRule = currentRule.parent as Rule | AtRule | Container;
  }

  return ancestors;
};
