import { ShellInterface } from "./shell";

export interface TerminalInterface {
  width: number;
  height: number;
  commandHistory: string[];
  buffer: string[];

  shell: ShellInterface;
}

export function terminal(element: HTMLElement, commands?: string[]) {

}
