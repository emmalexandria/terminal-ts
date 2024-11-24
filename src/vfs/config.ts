import { File, Folder } from "./basic";

interface ConfigFile {
  [name: string]: ConfigFile[]
}

export interface VFSConfig {
  files: ConfigFile
}


