import { Fs, VirtualDirectory } from "../vfs/index.js";
import { Terminal } from "./terminal.js";

export type PromptCallback = (update: PromptUpdate) => void;

interface PromptUpdate {
  currentCommand?: string
  vfs: Fs,
  lastCommandSuccess?: string
}

export function inputEventListener(ev: KeyboardEvent, terminal: Terminal, input: HTMLInputElement) {
  ev.preventDefault()
  if (ev.key === "Enter") {
    terminal.input(input.value)
    input.value = ""
  } else {
    input.value += ev.key
  }
}
