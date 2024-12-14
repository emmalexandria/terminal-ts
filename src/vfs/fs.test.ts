import { test, expect } from "vitest"
import { buildVFS } from "./server/build.js"


test("Get working directory", async () => {
  const Fs = await buildVFS("src/vfs")

  expect(Fs.getWd()).toEqual(Fs.root)
})

test("Change working directory", async () => {
  const Fs = await buildVFS("src/vfs")
  Fs.cwd("server")
  expect(Fs.root.entries).toBeDefined()
  expect(Fs.getWd()).toEqual(Fs.root.entries?.server)
})
