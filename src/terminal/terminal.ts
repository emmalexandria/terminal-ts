import { Command } from "./command";
import { Vfs } from "../vfs/index"

export type OutputCallback = () => void;


export interface TerminalInterface {
  /** Array of commands accessible from any path */
  commands: Command[];
  vfs: Vfs
  OutputCallback: OutputCallback
}
