import { Terminal } from "./terminal.js";


export type CommandFunction = (term: Terminal) => Promise<void>

export interface Command {
  name: string;
  run: CommandFunction
}



