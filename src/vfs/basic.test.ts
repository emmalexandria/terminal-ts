import { test, expect } from 'vitest'
import { VFS, File, FSItem, Folder } from './vfs'

export const createTestVFS = (): VFS => {
  const vfs = new VFS()
  const home: Folder = {
    name: "home",
    type: "folder",
    children: [
      {
        type: "folder",
        name: "user",
        children: []
      }
    ]
  }
  vfs.files.push(home)

  return vfs
}

test('test-vfs-open', () => {
  const testVFS = createTestVFS()

  const userFolder = testVFS.open("/home/user")
  expect(userFolder).toEqual({ type: "folder", name: "user", children: [] } satisfies Folder)

})
