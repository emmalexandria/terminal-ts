import { Command } from "./command.js";
import { Vfs } from "../vfs/vfs.js";
import { HelpStartup } from "./commands/help.js";

export interface ColorInterface {
  ansi16?: Ansi16,
  rgb?: Rgb
}

export class Color {
  ansi16?: Ansi16
  rgb?: Rgb

  constructor(color?: ColorInterface) {
    if (!color) {
      this.ansi16 = Ansi16.DEFAULT
      return
    }
    let { ansi16, rgb } = color
    if (rgb) {
      this.rgb = rgb
      return
    }
    if (ansi16) {
      this.ansi16 = ansi16
      return
    }
    this.ansi16 = Ansi16.DEFAULT
  }
}

export enum Ansi16 {
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

export interface Rgb {
  r: number,
  g: number,
  b: number
}


export enum Attribute {
  BOLD = "bold",
  ITALIC = "italic",
  DIM = "dim",
  UNDERLINE = "underline",
  BLINKING = "blink",
}

export interface TerminalText {
  text: string;
  fg: Color;
  bg: Color;
  attributes: Attribute[];
}

export type OutputCallback = (line: HTMLSpanElement) => void;

export type PromptUpdateCallback = (update: PromptUpdate) => void;
export type PromptContentCallback = () => string;

interface PromptUpdate {
  content?: string
  currentCommand?: string;
  vfs?: Vfs;
  lastCommandSuccess?: boolean;
}

export class Terminal {
  commands: Command[];
  startupCommand?: Command;
  history: string[];
  historyIdx: number
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
    this.history = [];
    this.historyIdx = -1;
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
      const result = this._runcommand(command, parts.slice(1));
      if (result) {
        this.history.push(input)
      }
      this.promptUpdateCallback({
        vfs: this.vfs,
        currentCommand: command.name,
      });
      return;
    } else {
      this.printColoredLine({
        text: `No command found for ${input}`,
        fg: new Color({ ansi16: Ansi16.RED }),
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
      this.printColoredLine(createTerminalText(error.message, new Color({ ansi16: Ansi16.RED })))
      this.promptUpdateCallback({ lastCommandSuccess: false })
      return false
    }
    this.promptUpdateCallback({ lastCommandSuccess: true })
    return true
  }
}

function makeDefaultText(input: string): TerminalText {
  const output = {
    text: input,
    fg: new Color(),
    bg: new Color(),
    attributes: [],
  };
  return output;
}

export function createTerminalText(text: string, fg?: Color, bg?: Color, attributes?: Attribute[]): TerminalText {
  return {
    text,
    fg: fg ?? new Color(),
    bg: bg ?? new Color(),
    attributes: attributes ?? []
  }
}

export function renderTerminalTextLine(text: TerminalText[]): HTMLSpanElement {
  const span: HTMLSpanElement = document.createElement("span");
  span.style.display = "block";
  span.classList.add("terminal-line")
  span.style.whiteSpace = "pre-wrap";
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
  paragraph.style.whiteSpace = "pre-wrap";
  paragraph.textContent = text.text;
  colorElement(text.fg, paragraph, false)
  colorElement(text.bg, paragraph, true)
  text.attributes.forEach((a) => {
    paragraph.classList.add(a);
  });
  return paragraph;
}

function colorElement(color: Color, el: HTMLElement, background?: boolean) {
  if (!background) {
    background = false
  }
  if (color.rgb) {
    const colorString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
    if (background) {
      el.style.backgroundColor = colorString;
    } else {
      el.style.color = colorString;
    }
    return
  }
  if (color.ansi16) {
    el.classList.add(colorToClassName(color.ansi16, background))
  }
}

function colorToClassName(color: Ansi16, background?: boolean): string {
  if (!background) {
    background = false;
  }
  const retColor: string = `${background ? "bg" : "fg"}-${color}`;
  return retColor;
}
