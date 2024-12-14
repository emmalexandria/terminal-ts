import { Command } from "./command.js";
import { Vfs } from "../vfs/vfs.js";
import { HelpStartup } from "./commands/help.js";

export enum OutputColor {
  BLACK = "black",
  BRIGHTBLACK = "bright-black",
  WHITE = "white",
  BRIGHTWHITE = "bright-white",
  RED = "red",
  BRIGHTRED = "bright-red",
  GREEN = "green",
  BRIGHTGREEN = "bright-green",
  YELLOW = "yellow",
  BRIGHTYELLOW = "bright-yellow",
  BLUE = "blue",
  BRIGHTBLUE = "bright-blue",
  MAGENTA = "magenta",
  BRIGHTMAGENTA = "bright-magenta",
  CYAN = "cyan",
  BRIGHTCYAN = "bright-cyan",
  DEFAULT = "default",
}

export enum OutputAttributes {
  BOLD = "bold",
  ITALIC = "italic",
  DIM = "dim",
  UNDERLINE = "underline",
  BLINKING = "blink",
}

export interface TerminalText {
  text: string;
  fg: OutputColor;
  bg: OutputColor;
  attributes: OutputAttributes[];
}

export type OutputCallback = (line: HTMLSpanElement) => void;

export type PromptUpdateCallback = (update: PromptUpdate) => void;
export type PromptContentCallback = () => string;

interface PromptUpdate {
  currentCommand?: string;
  vfs: Vfs;
  lastCommandSuccess?: string;
}

export class Terminal {
  commands: Command[];
  startupCommand?: Command;
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
    startupCommand?: Command
  ) {
    this.outputCallback = outputCallback;
    this.promptUpdateCallback = promptCallback;
    this.promptContentCallback = promptContentCallback;
    this.vfs = vfs;
    this.commands = [];
    this.lines = [];
    if (!startupCommand) {
      startupCommand = HelpStartup
    }
    this.startupCommand = startupCommand

    this._runcommand(startupCommand, [])
  }

  print(input: string) {
    const lines = input.split('\n');
    lines.forEach((l) => {
      this.lines.push([makeDefaultText(l)])
      this.outputCallback(renderTerminalTextLine([makeDefaultText(l)]));
    })
  }

  printColoredLine(text: TerminalText) {
    this.lines.push([text]);
    this.outputCallback(renderTerminalTextLine([text]));
  }

  printColored(text: TerminalText[]) {
    this.lines.push(text);
    this.outputCallback(renderTerminalTextLine(text))
  }

  input(input: string) {
    const parts = input.split(/\s+/);
    const command = this.commands.find((c) => c.name == parts[0]);
    if (command) {
      this.print(this.promptContentCallback());
      this._runcommand(command, parts.slice(1));
      this.promptUpdateCallback({
        vfs: this.vfs,
        currentCommand: command.name,
      });
      return;
    } else {
      this.printColoredLine({
        text: `No command found for ${input}`,
        fg: OutputColor.RED,
        bg: OutputColor.DEFAULT,
        attributes: [],
      });
    }
  }

  _runcommand(command: Command, args: string[]) {
    try {
      command.run(this, args);
    } catch (e) {
      const error = e as Error;
      this.printColoredLine({ text: error.message, fg: OutputColor.RED, bg: OutputColor.DEFAULT, attributes: [] })
    }
  }
}

function makeDefaultText(input: string): TerminalText {
  const output = {
    text: input,
    fg: OutputColor.DEFAULT,
    bg: OutputColor.DEFAULT,
    attributes: [],
  };
  return output;
}

export function renderTerminalTextLine(text: TerminalText[]): HTMLSpanElement {
  const span: HTMLSpanElement = document.createElement("span");
  span.style.display = "block";
  span.classList.add("terminal-line")
  span.style.whiteSpace = "pre";
  text.forEach((t) => {
    const paragraph = renderTerminalText(t);
    span.appendChild(paragraph)
  })

  return span
}

function renderTerminalText(text: TerminalText): HTMLParagraphElement {
  const paragraph: HTMLParagraphElement = document.createElement("p");
  paragraph.style.display = "inline-block";
  paragraph.style.margin = "0";
  paragraph.style.whiteSpace = "pre";
  paragraph.textContent = text.text;
  paragraph.classList.add(colorToClassName(text.fg, false));
  paragraph.classList.add(colorToClassName(text.bg, true));
  text.attributes.forEach((a) => {
    paragraph.classList.add(a);
  });
  return paragraph;

}

function colorToClassName(color: OutputColor, background?: boolean): string {
  if (!background) {
    background = false;
  }
  const retColor: string = `${background ? "bg" : "fg"}-${color}`;
  return retColor;
}
