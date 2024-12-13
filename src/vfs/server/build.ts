import {
  FileType,
  FSEntry,
  VirtualDirectory,
  VirtualFile,
  VirtualSymlink,
} from "vfs/vfs.js";
import path, { relative } from "path";
import fs, { Dirent, Stats } from "fs";
import { Fs } from "../fs.js";

export const buildVFS = async (root: string): Promise<Fs> => {
  const VFS = await walkDir(path.resolve(root));
  makeDirectoryRelative(VFS);
  return new Fs(VFS);
};

const walkDir = async (dir: string): Promise<VirtualDirectory> => {
  const root = await vfsDirectoryFromPath(dir);
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      root.entries[entry.name] = await walkDir(fullPath);
      continue;
    }

    const stat = await fs.promises.stat(fullPath);
    const fsEntry: FSEntry = {
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
      const file: VirtualFile = {
        ...fsEntry,
        content: await fs.promises.readFile(fullPath),
        type: "file",
      };
      root.entries[entry.name] = file;
    }
    if (fsEntry.type == "symlink") {
      const symlink: VirtualSymlink = {
        ...fsEntry,
        target: await fs.promises.readlink(fullPath),
        type: "symlink",
      };
      root.entries[entry.name] = symlink;
    }
  }
  return root;
};

const makeDirectoryRelative = (dir: VirtualDirectory) => {
  dir.path = ".";
  const makeChildrenRelative = (currentDir: VirtualDirectory) => {
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
): Promise<VirtualDirectory> => {
  const stat = await fs.promises.stat(fullPath);
  const fileEntry: VirtualDirectory = {
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

const getFileType = (file: Dirent | Stats): FileType => {
  if (file.isDirectory()) {
    return "directory";
  }
  if (file.isFile()) {
    return "file";
  }
  if (file.isSymbolicLink()) {
    return "symlink";
  }
  return "file";
};
