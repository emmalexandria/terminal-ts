import {
  EntryType,
  VfsEntry,
} from "vfs/vfs.js";
import path, { relative } from "path";
import fs, { Dirent, Stats } from "fs";
import { FsError, Vfs } from "../fs.js";

export const buildVFS = async (root: string): Promise<Vfs> => {
  const VFS = await walkDir(path.resolve(root));
  makeDirectoryRelative(VFS);
  return new Vfs(VFS);
};

const walkDir = async (dir: string): Promise<VfsEntry> => {
  const root = await vfsDirectoryFromPath(dir);
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && root.entries) {
      root.entries[entry.name] = await walkDir(fullPath);
      continue;
    }

    const stat = await fs.promises.stat(fullPath);
    const fsEntry: VfsEntry = {
      name: entry.name,
      path: entry.parentPath,
      type: getFileType(entry),
      size: stat.size,
      times: {
        createdAt: stat.ctime,
        modifiedAt: stat.mtime,
        accessedAt: stat.atime,
      },
    };
    if (fsEntry.type == "file") {
      const file: VfsEntry = {
        ...fsEntry,
        fileContent: await fs.promises.readFile(fullPath),
        type: "file",
      };
      if (root.entries) {
        root.entries[entry.name] = file;
      }
    }
  }
  return root;
};

const makeDirectoryRelative = (dir: VfsEntry) => {
  dir.path = ".";
  const makeChildrenRelative = (currentDir: VfsEntry) => {
    if (!currentDir.entries) {
      return new FsError("Entry is not directory")
    }
    for (const key of Object.keys(currentDir.entries)) {
      currentDir.entries[key].path = path.relative(
        currentDir.path,
        currentDir.entries[key].path,
      );
    }
  };

  makeChildrenRelative(dir);
};

export const vfsDirectoryFromPath = async (
  fullPath: string,
): Promise<VfsEntry> => {
  const stat = await fs.promises.stat(fullPath);
  const fileEntry: VfsEntry = {
    name: path.basename(fullPath),
    path: path.dirname(fullPath),
    type: "directory",
    size: stat.size,
    times: {
      createdAt: stat.ctime,
      modifiedAt: stat.mtime,
      accessedAt: stat.atime,
    },
    entries: {},
  };
  return fileEntry;
};

const getFileType = (file: Dirent | Stats): EntryType => {
  if (file.isDirectory()) {
    return "directory";
  }
  if (file.isFile()) {
    return "file";
  }

  return "file";
};
