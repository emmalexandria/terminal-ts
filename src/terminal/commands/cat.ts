import { Command } from "../command.js"

export const Cat: Command = {
  name: "cat",
  description: "Print the contents of a file",
  type: "synchronous",
  run: (t, a) => {
    if (!a[0]) {
      throw new Error("Invalid arguments, please provide a file")
    }
    try {
      const content = t.vfs.readFile(a[0]);
      t.print(content)
    } catch (e) {
      throw e
    }
  }
}
