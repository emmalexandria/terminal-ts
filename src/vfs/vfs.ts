import path from "path-browserify";

type Timestamp = Date;

interface Timestamps {
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  accessedAt: Timestamp;
}

export type FileType = "file" | "directory" | "symlink";

export type ServerEntry = {
  serverPath?: string;
};

export interface EntryChildren {
  [key: string]: VirtualFile | VirtualDirectory | VirtualSymlink;
}

export interface FSEntry {
  name: string;
  path: string;
  type: FileType;
  size: number;
  times: Timestamps;
  serverEntry?: ServerEntry;
}

export interface VirtualFile extends FSEntry {
  type: "file";
  content: Uint8Array | null;
  encoding?: BufferEncoding;
}

export interface VirtualDirectory extends FSEntry {
  type: "directory";
  entries: EntryChildren;
}

export interface VirtualSymlink extends FSEntry {
  type: "symlink";
  target: string;
}

export const FSRoot: VirtualDirectory = {
  name: "",
  path: "/",
  type: "directory",
  size: 0,
  times: {
    createdAt: new Date(),
    modifiedAt: new Date(),
    accessedAt: new Date(),
  },
  entries: {},
};

export class Vfs {
  root: VirtualDirectory
  cwd: VirtualDirectory

  constructor(root: VirtualDirectory) {
    this.root = root
    this.cwd = root
  }

}
