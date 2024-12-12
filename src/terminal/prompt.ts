import { Vfs, VirtualDirectory } from "vfs";

export type PromptCallback = () => void;

interface PromptUpdate {
  currentCommand?: string
  vfs: Vfs
}
