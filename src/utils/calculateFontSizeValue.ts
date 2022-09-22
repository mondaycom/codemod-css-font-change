import { fontSizeVariables } from "../constants/fontSizeVariables";

export const calculateFontSizeValue = (value: string): number => {
  if (value.includes("var(--")) {
    const variableName = value.replace("var(", "").replace(")", "");
    return +(fontSizeVariables[variableName] || value).replace("px", "");
  }
  return +value.replace("px", "");
};
