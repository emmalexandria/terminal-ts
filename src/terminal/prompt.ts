import { Vfs } from "../vfs/index.js";
import { Terminal } from "./terminal.js";

export type PromptCallback = (update: PromptUpdate) => void;

interface PromptUpdate {
  currentCommand?: string
  vfs: Vfs,
  lastCommandSuccess?: string
}


