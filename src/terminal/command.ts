import { Vfs } from "vfs"
import { OutputCallback } from "./terminal"

export type CommandType = "synchronous" | "continuous"

export interface Command {
  name: string
  run: (vfs: Vfs, outputCallback: OutputCallback) => void
}
