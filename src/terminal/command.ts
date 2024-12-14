import { OutputCallback, Terminal } from "./terminal.js";

export type CommandType = "synchronous" | "continuous";

export interface Command {
  name: string;
  description?: string;
  type: CommandType;
  run: (terminal: Terminal, args: string[]) => void;
}
