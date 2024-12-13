import path from "path-browserify";

type Timestamp = Date;

interface Timestamps {
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  accessedAt: Timestamp;
}


export type ServerEntry = {
  serverPath?: string;
};

export type EntryType = "directory" | "file";

export interface EntryChildren {
  [key: string]: VfsEntry;
}

export interface VfsEntry {
  name: string;
  type: EntryType;
  path: string;
  size: number;
  times: Timestamps;
  serverEntry?: ServerEntry;
  entries?: EntryChildren
  fileContent?: Buffer
}

/// Represents a path through the path of children one must go through to access the file
export interface VirtualPath {
  path: number[]
}

export const FSRoot: VfsEntry = {
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


