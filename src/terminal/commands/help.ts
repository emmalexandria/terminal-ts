import { Command } from "../command.js";

export const Help: Command = {
  name: "help",
  type: "synchronous",
  description: "Print a list of all available commands",
  run: (t, a) => {
    t.commands.forEach((c) => {
      t.print(`${c.name} - ${c.description}`)
    })
  }
}
