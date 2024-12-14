import { test, expect } from "vitest";
import { serverBuildVfsRoot } from "./server.js";
import { Vfs } from "./vfs.js";

test("Get working directory", async () => {
  const Fs = new Vfs(await serverBuildVfsRoot("src/vfs"));

  expect(Fs.getWd()).toEqual(Fs.root);
});

test("Change working directory", async () => {
  const Fs = new Vfs(await serverBuildVfsRoot("src"));
  Fs.cwd("vfs");
  expect(Fs.root.entries).toBeDefined();
  expect(Fs.getWd()).toEqual(Fs.root.entries?.vfs);
});
