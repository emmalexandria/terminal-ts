import { TerminalCommand } from "../shell/command"
import { Path } from "./path";

export type FileType = "binary" | "text" | "media"

export interface FSItem {
  name: string;
  extension?: string;
  children: FSItem[] | undefined
}

export interface Folder extends FSItem {
  type: "folder";
  children: (Folder | File)[]
}

export interface File extends FSItem {
  type: FileType;
  children: undefined;
  content: string[];
  execute?: {
    command: TerminalCommand
  }
}

export const createFolder = (name: string, children?: (Folder | File)[]): Folder => {
  return {
    name,
    "type": "folder",
    children: children ?? []
  }
}

export const createFile = (name: string, type: FileType, content?: string[]): File => {
  return {
    type,
    name,
    content: content ?? [],
    children: undefined
  }
}

export class VFS {
  files: FSItem[]
  cwd: Path

  constructor() {
    this.files = []
    this.cwd = new Path('/')
  }

  open(path: Path | string): FSItem | null {
    if (!(path instanceof Path)) {
      path = new Path(path)
    }
    for (const file of this.files) {
      const result = this.#traverse_tree(path, file)
      if (result != null) return result
    }
    return null
  }

  #traverse_tree(path: Path, currentItem: FSItem | null): FSItem | null {
    const parts = path.split().slice(1);
    for (const part of parts) {
      if (currentItem == null) return null


      if (currentItem?.name == parts[parts.length - 1]) break


      currentItem = currentItem.children?.find((c) => c.name === part) || null
    }

    return currentItem
  }
}
