export interface ColorInterface {
  ansi16?: Ansi;
  rgb?: Rgb;
}

export class Color {
  ansi16?: Ansi;
  rgb?: Rgb;

  constructor(color?: ColorInterface) {
    if (!color) {
      this.ansi16 = Ansi.DEFAULT;
      return;
    }
    const { ansi16, rgb } = color;
    if (rgb) {
      this.rgb = rgb;
      return;
    }
    if (ansi16) {
      this.ansi16 = ansi16;
      return;
    }
    this.ansi16 = Ansi.DEFAULT;
  }
}

export enum Ansi {
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
  r: number;
  g: number;
  b: number;
}

export enum Attribute {
  BOLD = "bold",
  ITALIC = "italic",
  DIM = "dim",
  UNDERLINE = "underline",
  BLINKING = "blink",
}

export interface TerminalLink {
  href: string;
  target: "_blank" | "_self";
}

export interface TerminalText {
  text: string;
  fg: Color;
  bg: Color;
  attributes: Attribute[];
  link?: TerminalLink;
}

export function renderTerminalTextLine(text: TerminalText[]): HTMLSpanElement {
  const span: HTMLSpanElement = document.createElement("span");
  span.style.display = "block";
  span.classList.add("terminal-line");
  span.style.whiteSpace = "pre-wrap";
  text.forEach((t) => {
    const paragraph = renderTerminalText(t);
    span.appendChild(paragraph);
  });

  return span;
}

export function renderTerminalText(
  text: TerminalText,
): HTMLParagraphElement | HTMLAnchorElement {
  let element: HTMLParagraphElement | HTMLAnchorElement;
  if (text.link) {
    element = document.createElement("a") as HTMLAnchorElement;
    element.href = text.link.href;
    element.target = text.link.target;
  } else {
    element = document.createElement("p") as HTMLParagraphElement;
  }
  element.style.display = "inline-block";
  element.style.margin = "0";
  element.style.whiteSpace = "pre-wrap";
  element.textContent = text.text;
  colorElement(text.fg, element, false);
  colorElement(text.bg, element, true);
  text.attributes.forEach((a) => {
    element.classList.add(a);
  });
  return element;
}

function colorElement(color: Color, el: HTMLElement, background?: boolean) {
  if (!background) {
    background = false;
  }
  if (color.rgb) {
    const colorString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    if (background) {
      el.style.backgroundColor = colorString;
    } else {
      el.style.color = colorString;
    }
    return;
  }
  if (color.ansi16) {
    el.classList.add(colorToClassName(color.ansi16, background));
  }
}

function colorToClassName(color: Ansi, background?: boolean): string {
  if (!background) {
    background = false;
  }
  const retColor: string = `${background ? "bg" : "fg"}-${color}`;
  return retColor;
}


