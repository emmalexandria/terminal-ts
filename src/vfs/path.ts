import { VFS } from "./vfs";

class Path {
  path: string;
  parentPath: string;
  name: string;
  basename: string;
  extension?: string;

  constructor(path: string) {
    this.path = path
    let parts = path.split('/')
    this.name = parts[parts.length - 1]
    this.parentPath = parts.slice(0, parts.length - 1).join('/')
    let nameParts = this.name.split('.')
    this.extension = '.' + nameParts[nameParts.length - 1]
    this.basename = nameParts.slice(0, nameParts.length - 1).join('.')
  }

  split(): string[] {
    if (this.path.at(0) == '/') {
      this.path = this.path.slice(1, this.path.length)
    }
    return this.path.split('/')
  }
}

export { Path }


