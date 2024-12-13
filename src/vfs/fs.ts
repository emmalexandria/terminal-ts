import { VirtualPath, VirtualDirectory, EntryChildren, FSEntry } from "./vfs"
import path from "path-browserify"

export class FsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FsError"
  }
}

export class Vfs {
  root: VirtualDirectory
  cwd: VirtualPath

  constructor(root: VirtualDirectory) {
    this.root = root
    this.cwd = {
      path: []
    }
  }

  cwd(cdPath: string): FsError | void {
    const normalized = path.normalize(cdPath)
    const segments = normalized.split("/")
    let currentDirectory: VirtualDirectory = this.getCwd()

    segments.forEach((segment) => {
      const entry = Object.entries(currentDirectory.entries).find((val) => val[0] === segment);
      if (entry && entry.) {
      }
    })

  }

  getWd(): VirtualDirectory {
    let currentDirectory: EntryChildren = { ".": this.root }
    this.cwd.path.forEach((idx) => {
      const currentEntry = Object.entries(currentDirectory)[0]
      const childArray = Array.from(Object.values(currentDirectory.entries))
      if (childArray.length < idx) {
        throw new FsError("Invalid path for cwd")
      }
      currentDirectory = childArray[idx]
    })

    return Object.values(currentDirectory)[0] as VirtualDirectory
  }

  readFile() {

  }

  readDirectory(): FSEntry[] {

  }
}



