import { test, expect } from "vitest"
import { buildVFS } from "./server/build.js"


test("Get CWD", async () => {
  const Fs = await buildVFS("src/vfs")

  expect(Fs.getCwd()).toEqual(Fs.root)
})

test("CD into directory", async () => {
  const Fs = await buildVFS("src/vfs")
  Fs.cd("server")

  expect(Fs.getCwd()).toEqual(Fs.root.entries["server"])
})
