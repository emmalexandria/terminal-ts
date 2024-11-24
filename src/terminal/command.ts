export interface TerminalCommand {
  name: string;
  call: (args: string) => void;
}
