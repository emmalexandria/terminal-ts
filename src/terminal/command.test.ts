import { Command } from "./command"
import { test, expect } from "vitest"

test('parse-options', () => {
  const command = new Command()
  command.name("printer").option("text", "Text to print")

  const args = command.parse("-t hello")
  expect(args).toBe({ args: [{ name: "text", value: "Text to print" }], command })
})
