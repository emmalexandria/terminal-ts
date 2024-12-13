import { OutputCallback, Terminal } from "./terminal.js"

export type CommandType = "synchronous" | "continuous"

export interface Command {
  name: string
  type: CommandType
  run: (terminal: Terminal) => void
}
