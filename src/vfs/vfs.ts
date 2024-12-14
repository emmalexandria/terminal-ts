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
  entries?: EntryChildren;
  fileContent?: Buffer;
}

/// Represents a path through the path of children one must go through to access the file
export type VirtualPath = number[];

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

export class VfsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FsError";
  }
}

export class Vfs {
  root: VfsEntry;
  wd: VirtualPath;

  constructor(root: VfsEntry) {
    this.root = root;
    this.wd = [];
  }

  cwd(cdPath: string): VfsError | void {
    const normalized = path.normalize(cdPath);
    const segments = normalized.split("/").filter((v) => v !== "");
    const currentDirectory: VfsEntry = this.getWd();

    segments.forEach((segment) => {
      if (!currentDirectory.entries) {
        throw new VfsError("Invalid path");
      }
      if (segment === "..") {
        if (this.wd.length >= 1) {
          this.wd.pop();
        }
        return;
      }
      if (segment == ".") {
        return;
      }

      const entry = Object.keys(currentDirectory.entries).findIndex((val) => {
        return val === segment;
      });

      if (entry == -1) {
        throw new VfsError("Invalid path");
      }

      this.wd.push(entry);
    });
  }

  getWd(): VfsEntry {
    let currentDirectory: VfsEntry = this.root;

    for (const idx of this.wd) {
      if (!currentDirectory.entries) {
        throw new VfsError("Invalid working directory state");
      }

      const childArray = Array.from(Object.values(currentDirectory.entries));
      currentDirectory = childArray[idx];
    }

    return currentDirectory;
  }
}
