import { Command } from "./command.js";
import { Vfs } from "../vfs/vfs.js";

enum OutputColor {
  BLACK = "black",
  WHITE = "white",
  RED = "red",
  GREEN = "green",
  YELLOW = "yellow",
  BLUE = "blue",
  MAGENTA = "magenta",
  CYAN = "cyan",
  DEFAULT = "default",
}

enum OutputAttributes {
  BOLD = "bold",
  ITALIC = "italic",
  DIM = "dim",
  BRIGHT = "bright",
  UNDERLINE = "underline",
  BLINKING = "blink",
}

export interface TerminalText {
  text: string;
  fg: OutputColor;
  bg: OutputColor;
  attributes: OutputAttributes[];
}

export type OutputCallback = (output: HTMLParagraphElement) => void;

export type PromptUpdateCallback = (update: PromptUpdate) => void;
export type PromptContentCallback = () => string;

interface PromptUpdate {
  currentCommand?: string;
  vfs: Vfs;
  lastCommandSuccess?: string;
}

export class Terminal {
  commands: Command[];
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
  ) {
    this.outputCallback = outputCallback;
    this.promptUpdateCallback = promptCallback;
    this.promptContentCallback = promptContentCallback;
    this.vfs = vfs;
    this.commands = [];
    this.lines = [];
  }

  print(input: string) {
    const lines = input.split('\n');
    lines.forEach((l) => {
      this.lines.push([makeDefaultText(l)])
      this.outputCallback(renderTerminalText(makeDefaultText(l)));
    })
    this.promptUpdateCallback({ vfs: this.vfs });
  }

  printColored(text: TerminalText) {
    this.lines.push([text]);
    this.outputCallback(renderTerminalText(text));
    this.promptUpdateCallback({ vfs: this.vfs });
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
      this.printColored({
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
      this.printColored({ text: error.message, fg: OutputColor.RED, bg: OutputColor.DEFAULT, attributes: [] })
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

export function renderTerminalText(text: TerminalText): HTMLParagraphElement {
  const paragraph: HTMLParagraphElement = document.createElement("p");
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
  const retColor: string = `${background ? "bg" : "fg"}${color}`;
  return retColor;
}
