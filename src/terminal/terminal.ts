import { Command } from "./command.js";
import { FSEntry, VirtualDirectory } from "vfs/fs.js";
import { Shell } from "./shell.js";


export class Terminal {
  commands: Command[]
  commandRunning: boolean
  cwd: string;
  vfs: VirtualDirectory
  content: string
  element: HTMLElement;
  backBuffer: HTMLElement | undefined;
  shell: Shell;

  constructor(element: HTMLElement, vfs: VirtualDirectory) {
    this.vfs = vfs
    this.commandRunning = false
    this.commands = []
    this.element = element;
    this.content = ""
    this.shell = new Shell(element, this)
    this.cwd = "/"
    this.element.classList.add("terminal-root")
  }

  async input(input: string) {
    const command = this.commands.find((c) => c.name == input)
    if (command) {
      this.commandRunning = true;
      command.run(this).then(() => { this.commandRunning = false; this.shell.update() })

    }
  }

  async print(line: string) {
    const p = document.createElement('p')
    p.textContent = line;
    if (this.element.childElementCount == 0) {
      this.element.appendChild(p)
    } else if (this.element.firstChild) {
      this.element.insertBefore(p, this.element.firstChild)
    }
  }

  command(name: string, run: (term: Terminal) => Promise<void>) {
    this.commands.push({ name, run })
  }
}
