import { VirtualPath, EntryChildren, VfsEntry } from "./vfs"
import path from "path-browserify"

export class FsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FsError"
  }
}

export class Vfs {
  root: VfsEntry
  wd: VirtualPath

  constructor(root: VfsEntry) {
    this.root = root
    this.wd = {
      path: []
    }
  }

  cwd(cdPath: string): FsError | void {
    const normalized = path.normalize(cdPath)
    const segments = normalized.split("/")
    let currentDirectory: VfsEntry = this.getWd()

    segments.forEach((segment) => {
      if (!currentDirectory.entries) {
        return new FsError("Invalid path")
      }

      const entry = Object.keys(currentDirectory.entries).findIndex((val) => {
        return val === segment
      });

      if (!entry) {
        return new FsError("Invalid path")
      }

      this.wd.path.push(entry)
    })
  }

  getWd(): VfsEntry {
    let currentDirectory: VfsEntry = this.root

    for (let idx of this.wd.path) {
      if (!currentDirectory.entries) {
        throw new FsError("Invalid working directory state")
      }

      const childArray = Array.from(Object.values(currentDirectory.entries))
      currentDirectory = childArray[idx]
    }

    return currentDirectory
  }
}



