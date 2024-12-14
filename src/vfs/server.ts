import { EntryType, VfsEntry } from "vfs/vfs.js";
import path, { relative } from "path";
import fs, { Dirent, Stats } from "fs";
import { VfsError, Vfs } from "./vfs.js";

export const serverBuildVfsRoot = async (root: string): Promise<VfsEntry> => {
  const VFS = await walkDir(path.resolve(root));
  makeDirectoryRelative(VFS);
  return VFS;
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
        fileContent: await fs.promises
          .readFile(fullPath)
          .then((b) => b.toString("base64")),
        type: "file",
      };
      if (root.entries) {
        root.entries[entry.name] = file;
      }
    }
  }
  return root;
};

export const makeDirectoryRelative = (dir: VfsEntry) => {
  if (!dir.entries) {
    return;
  }

  const makeChildRelative = (currentDir: VfsEntry) => {
    if (!currentDir.entries) {
      currentDir.path = path.relative(dir.path, currentDir.path);
      return;
    }

    Object.values(currentDir.entries).forEach((child) => {
      makeChildRelative(child);
    });

    currentDir.path = path.relative(dir.path, currentDir.path);
  };

  Object.values(dir.entries).forEach((child) => {
    makeChildRelative(child);
  });

  dir.path = "";
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
