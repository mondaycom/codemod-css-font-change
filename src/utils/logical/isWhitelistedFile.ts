import { WHITELISTED_DIRECTORIES_LIST, WHITELISTED_FILES_LIST } from "../../constants/whilteList";

export const isWhitelistedFile = (filePath: string): boolean => {
  if (filePath.startsWith("../")) {
    filePath = filePath.replace("../", "");
  }
  let isWhitelistedDir = false;

  WHITELISTED_DIRECTORIES_LIST.forEach(d => {
    if (filePath.includes(`/${d}/`)) {
      isWhitelistedDir = true;
    }
  });

  return isWhitelistedDir || WHITELISTED_FILES_LIST.has(filePath);
};
