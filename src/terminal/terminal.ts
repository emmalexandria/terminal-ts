import { Command } from "./command.js";
import { Vfs } from "../vfs/vfs.js";
import { HelpStartup } from "./commands/help.js";
import { Ansi, Attribute, Color, createTerminalText, makeDefaultText, renderTerminalTextLine, TerminalText } from "./output.js";

export type OutputCallback = (line: HTMLSpanElement) => void;

export type PromptUpdateCallback = (update: PromptUpdate) => void;
export type PromptContentCallback = () => string;

interface PromptUpdate {
  content?: string;
  currentCommand?: string;
  vfs?: Vfs;
  lastCommandSuccess?: boolean;
}

export class Terminal {
  commands: Command[];
  startupCommand?: Command;
  history: string[];
  historyIdx: number;
  vfs: Vfs;
  outputCallback: OutputCallback;
  promptUpdateCallback: PromptUpdateCallback;
  promptContentCallback: PromptContentCallback;
  lines: TerminalText[][];

  constructor(
    vfs: Vfs,
    outputCallback: OutputCallback,
    promptCallback: PromptUpdateCallback,
    promptContentCallback: PromptContentCallback,
    startupCommand?: Command,
  ) {
    this.outputCallback = outputCallback;
    this.promptUpdateCallback = promptCallback;
    this.promptContentCallback = promptContentCallback;
    this.vfs = vfs;
    this.history = [];
    this.historyIdx = -1;
    this.commands = [];
    this.lines = [];
    if (!startupCommand) {
      startupCommand = HelpStartup;
    }
    this.startupCommand = startupCommand;

    this._runcommand(startupCommand, []);
  }

  print(input: string) {
    const lines = input.split("\n");
    lines.forEach((l) => {
      this.lines.push([makeDefaultText(l)]);
      this.outputCallback(renderTerminalTextLine([makeDefaultText(l)]));
    });
  }

  printColoredLine(text: TerminalText) {
    this.lines.push([text]);
    this.outputCallback(renderTerminalTextLine([text]));
  }

  printColored(text: TerminalText[]) {
    this.lines.push(text);
    this.outputCallback(renderTerminalTextLine(text));
  }

  input(input: string) {
    const parts = input.split(/\s+/);
    const command = this.commands.find((c) => c.name == parts[0]);
    if (command) {
      this.print(this.promptContentCallback());
      const result = this._runcommand(command, parts.slice(1));
      if (result) {
        this.history.push(input);
      }
      this.promptUpdateCallback({
        vfs: this.vfs,
        currentCommand: command.name,
      });
      return;
    } else {
      this.printColoredLine({
        text: `No command found for ${input}`,
        fg: new Color({ ansi16: Ansi.RED }),
        bg: new Color(),
        attributes: [],
      });
    }
  }

  _runcommand(command: Command, args: string[]): boolean {
    try {
      command.run(this, args);
    } catch (e) {
      const error = e as Error;
      this.printColoredLine(
        createTerminalText(error.message, new Color({ ansi16: Ansi.RED })),
      );
      this.promptUpdateCallback({ lastCommandSuccess: false });
      return false;
    }
    this.promptUpdateCallback({ lastCommandSuccess: true });
    return true;
  }
}


