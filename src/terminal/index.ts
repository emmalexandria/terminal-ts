import { FSItem, LocalFS } from "../vfs/basic";
import { ShellInterface } from "./shell";
import { TerminalInterface } from "./terminal";

export class Shell implements ShellInterface {
  vfs: LocalFS;
  prompt: string;
  path: FSItem[];

  constructor(vfs: LocalFS, path: FSItem[]) {
    this.vfs = vfs;
    this.prompt = `${this.vfs.cwd} $`
    this.path = path;
  }
}

export class Terminal implements TerminalInterface {
  width: number;
  height: number;
  commandHistory: string[];
  buffer: string[];
  shell: ShellInterface;
  element: Element;

  constructor(width: number, height: number, shell: ShellInterface, element: Element) {
    this.width = width;
    this.height = height;
    this.commandHistory = [];
    this.buffer = [];
    this.shell = shell;
    this.element = element;

    document.addEventListener("keypress", this.keyHandler)
  }

  keyHandler(event: KeyboardEvent) {
    console.log(event.key)
  }
}
