import * as dapulse from "./dapulseConstants";
import * as vibe from "./vibeConstants";

enum VERSIONS {
  DAPULSE,
  VIBE
}

const CURRENT_VERSION = VERSIONS.DAPULSE;
// const CURRENT_VERSION = VERSIONS.VIBE;

export const IMPORT_STATEMENT = CURRENT_VERSION === VERSIONS.DAPULSE ? dapulse.IMPORT_STATEMENT : vibe.IMPORT_STATEMENT;

export const SELECTOR_PREFIX = CURRENT_VERSION === VERSIONS.DAPULSE ? dapulse.SELECTOR_PREFIX : vibe.SELECTOR_PREFIX;

export const RULES_TO_INSERT = CURRENT_VERSION === VERSIONS.DAPULSE ? dapulse.RULES_TO_INSERT : vibe.RULES_TO_INSERT;