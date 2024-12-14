import { Command } from "../command.js";

export const Ls: Command = {
  name: "ls",
  type: "synchronous",
  run: (t, a) => {
    console.log(t)
    const cwd = t.vfs.getWd();
    if (cwd.entries) {
      Object.values(cwd.entries).forEach((e) => {
        t.print(e.name)
      })
    }
  }
}
