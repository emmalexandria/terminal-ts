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

/// Represents a path through the path of children one must go through to access the file
export interface VirtualPath {
  path: number[]
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


