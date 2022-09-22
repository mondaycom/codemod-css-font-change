import { AtRule, Container, Rule, ChildNode, Declaration } from "postcss";
import { getRuleFullSelector } from "./getRuleFullSelector";

/**
 * Combine Rules with AtRules, generating embedded structure (which is flattened by combining Rules, where possible)
 * @param declAncestors
 * @param ruleToInsert
 * @param selectorPrefix
 */
export const combineAtRulesWithRules = (
  declAncestors: (Rule | AtRule | Container<ChildNode>)[],
  ruleToInsert: AtRule | Declaration,
  selectorPrefix: string
): Rule | AtRule | Container | undefined => {
  let lastInsertedNode: Rule | AtRule | Container | undefined;

  let i = 0;
  while (i < declAncestors?.length) {
    if (declAncestors[i].type === "rule") {
      const fontRuleSelector = getRuleFullSelector(declAncestors[i] as Rule);
      const nodes: (Declaration | AtRule | Rule | Container)[] = [];
      if (!lastInsertedNode) {
        nodes.push(ruleToInsert);
      } else {
        nodes.push(lastInsertedNode);
      }
      lastInsertedNode = new Rule({ selector: fontRuleSelector, nodes: nodes });

      // Skip upcoming rules because they are already in selector
      while (i < declAncestors?.length && declAncestors[i].type === "rule") {
        i++;
      }
    }

    if (i < declAncestors?.length && declAncestors[i].type === "atrule") {
      const oldRule = declAncestors[i] as AtRule;
      const nodes: (Declaration | AtRule | Rule | Container)[] = [];
      if (!lastInsertedNode) {
        nodes.push(ruleToInsert);
      } else {
        nodes.push(lastInsertedNode);
      }
      lastInsertedNode = new AtRule({ name: oldRule.name, params: oldRule.params, nodes: nodes });
      i++;
    }
  }

  if (lastInsertedNode?.type === "rule") {
    const lastInsertedRule = lastInsertedNode as Rule;
    lastInsertedRule.selector = `${selectorPrefix}${lastInsertedRule.selector}`;
    return lastInsertedRule;
  } else {
    lastInsertedNode?.nodes.map(n => {
      if (n.type === "rule") {
        n.selector = `${selectorPrefix}${n.selector}`;
      }
    });
    return lastInsertedNode;
  }
};
