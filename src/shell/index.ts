import { FSItem, VFS } from "../vfs";

export class Shell {
  vfs: VFS;
  prompt: string;
  path: FSItem[];

  constructor(vfs: VFS, path: FSItem[]) {
    this.vfs = vfs;
    this.prompt = `${this.vfs.cwd} $`
    this.path = path;
  }
}
