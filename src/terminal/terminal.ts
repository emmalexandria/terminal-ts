import { Command } from "./command.js";
import { Fs } from "../vfs/index.js"
import { PromptCallback } from "./prompt.js";

export type OutputCallback = (output: string) => void;


export class Terminal {
  commands: Command[]
  vfs: Fs
  outputCallback: OutputCallback
  promptCallback: PromptCallback
  lines: string[]

  constructor(vfs: Fs, outputCallback: OutputCallback, promptCallback: PromptCallback) {
    this.outputCallback = outputCallback;
    this.promptCallback = promptCallback;
    this.vfs = vfs;
    this.commands = []
    this.lines = []
  }

  input(input: string) {
    this.lines.push(input)
    this.outputCallback(input)
    this.promptCallback({ vfs: this.vfs })
  }
}
