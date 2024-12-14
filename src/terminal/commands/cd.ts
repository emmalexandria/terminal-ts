import { Command } from "../command.js";

export const Cd: Command = {
  name: "cd",
  type: "synchronous",
  run: (t, a) => {
    try {
      let path = a[0];
      if (!path) {
        path = ".";
      }
      t.vfs.cwd(path);
    } catch (e) {
      throw e;
    }
  },
};
