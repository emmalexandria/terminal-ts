import { test, expect } from "vitest";
import { makeDirectoryRelative } from "./server";
import { VfsEntry } from "./vfs";

test("Make directory paths relative", async () => {
  const vfs: VfsEntry = {
    name: "root",
    path: "users/emma/root",
    type: "directory",
    size: 0,
    times: {
      createdAt: new Date(),
      modifiedAt: new Date(),
      accessedAt: new Date(),
    },
    entries: {
      vfs: {
        name: "vfs",
        path: "users/emma/root/vfs",
        type: "directory",
        size: 0,
        times: {
          createdAt: new Date(),
          modifiedAt: new Date(),
          accessedAt: new Date(),
        },
        entries: {
          "test.txt": {
            name: "test.txt",
            path: "users/emma/root/vfs/test.txt",
            type: "file",
            size: 35,
            times: {
              createdAt: new Date(),
              modifiedAt: new Date(),
              accessedAt: new Date(),
            },
          },
        },
      },
    },
  };
  const expectedResult: VfsEntry = {
    name: "root",
    path: "",
    type: "directory",
    size: 0,
    times: {
      createdAt: new Date(),
      modifiedAt: new Date(),
      accessedAt: new Date(),
    },
    entries: {
      vfs: {
        name: "vfs",
        path: "vfs",
        type: "directory",
        size: 0,
        times: {
          createdAt: new Date(),
          modifiedAt: new Date(),
          accessedAt: new Date(),
        },
        entries: {
          "test.txt": {
            name: "test.txt",
            path: "vfs/test.txt",
            type: "file",
            size: 35,
            times: {
              createdAt: new Date(),
              modifiedAt: new Date(),
              accessedAt: new Date(),
            },
          },
        },
      },
    },
  };

  makeDirectoryRelative(vfs);
  expect(vfs).toEqual(expectedResult);
});
