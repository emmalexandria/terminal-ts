import { TerminalCommand } from "../terminal/command"
import { FSItem, LocalFS, VFS } from "../vfs/basic"
import { Path } from "../vfs/path"


export class ServerFS extends VFS {
  constructor() {
    super()
  }

  create() {

  }

  runCommand(command: RemoteCommand) {

  }

  fromLocalFS(fs: LocalFS) {

  }
}

export interface RemoteCommand extends TerminalCommand {
  path: string
}
