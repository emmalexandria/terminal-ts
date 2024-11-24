import { InputStream, OutputStream } from "./streams";

export interface TerminalCommand {
  name: string;
  stdin: InputStream;
  stdout: OutputStream;
  call: (args: string) => void;
}
