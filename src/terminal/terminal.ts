import { Command } from "./command.js";
import { Vfs } from "../vfs/index.js"
import { PromptCallback } from "./prompt.js";

export type OutputCallback = (output: string) => void;


export class Terminal {
  commands: Command[]
  vfs: Vfs
  outputCallback: OutputCallback
  promptCallback: PromptCallback
  lines: string[]

  constructor(vfs: Vfs, outputCallback: OutputCallback, promptCallback: PromptCallback) {
    this.outputCallback = outputCallback;
    this.promptCallback = promptCallback;
    this.vfs = vfs;
    this.commands = []
    this.lines = []
  }

  print(input: string) {
    this.lines.push(input)
    this.outputCallback(input)
    this.promptCallback({ vfs: this.vfs })
  }

  input(input: string) {
    const command = this.commands.find((c) => c.name == input)
    if (command) {
      this._runcommand(command)
      this.promptCallback({ vfs: this.vfs, currentCommand: command.name })
      return
    }

    this.print(input)
  }

  _runcommand(command: Command) {
    command.run(this)
  }

}
