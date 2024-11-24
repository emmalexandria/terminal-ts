import { expect, test } from 'vitest'
import { Path } from './path'

test('test-path-splitting', () => {
  const path = new Path('money/hello/vite.config.ts')
  expect(path.path).toBe('money/hello/vite.config.ts')
  expect(path.name).toBe('vite.config.ts')
  expect(path.parentPath).toBe('money/hello')
  expect(path.extension).toBe('.ts')
  expect(path.basename).toBe('vite.config')
})
