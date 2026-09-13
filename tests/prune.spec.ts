/**
 * Prune tests: a real delete takes every operation that targets one entry id,
 * takes the comment block that introduces each of them, leaves every other
 * byte alone, and refuses anything it cannot do safely.
 *
 * @module dsh-mcp-panel/test/prune.spec
 */

import { describe, expect, it } from 'vitest'
import { pruneEntryOperations, PruneRefusal } from '../src/prune.ts'

const FILE = `- id: web-ui
  config:
    enabled: true

# hand-written: the 12306 bridge
- insert:
    - id: mcp-12306
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: train_12306
        transport: stdio

# dsh-mcp-panel: add server (2026-09-12)
- insert:
    - id: mcp-github
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: github
        transport: stdio

# dsh-mcp-panel: edit server mcp-github (2026-09-12)
- id: mcp-github
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: github
    transport: stdio
    command: npx

# dsh-mcp-panel: remove server mcp-github — disabled (2026-09-13)
- { id: mcp-github, name: '@deepseek-ai/dsh-mcp-client', disabled: true }

- id: usage-stats
  config:
    currency: USD
`

describe('pruneEntryOperations', () => {
  it('removes every operation for the id, with its comment block', () => {
    const result = pruneEntryOperations(FILE, 'mcp-github')
    expect(result.ops).toBe(3)
    expect(result.text).not.toContain('mcp-github')
    expect(result.text).not.toContain('serverName: github')
    expect(result.text).not.toContain('# dsh-mcp-panel: edit server')
  })

  it('leaves every other operation byte-identical', () => {
    const result = pruneEntryOperations(FILE, 'mcp-github')
    expect(result.text).toContain('# hand-written: the 12306 bridge')
    expect(result.text).toContain('      config:\n        serverName: train_12306\n        transport: stdio')
    expect(result.text).toContain('- id: usage-stats\n  config:\n    currency: USD')
    expect(result.text).toContain('- id: web-ui\n  config:\n    enabled: true')
  })

  it('keeps the file a line-subsequence of the original', () => {
    const kept = pruneEntryOperations(FILE, 'mcp-github').text.split('\n').filter(line => line !== '')
    const original = FILE.split('\n')
    let cursor = 0
    for (const line of kept) {
      const found = original.indexOf(line, cursor)
      expect(found).toBeGreaterThanOrEqual(0)
      cursor = found + 1
    }
  })

  it('refuses an id no operation targets', () => {
    expect(() => pruneEntryOperations(FILE, 'mcp-absent')).toThrow(PruneRefusal)
    expect(() => pruneEntryOperations(FILE, 'mcp-absent')).toThrow(/no operation/u)
  })

  it('refuses an operation that also targets another entry', () => {
    const shared = `- insert:
    - id: mcp-a
      name: '@deepseek-ai/dsh-mcp-client'
    - id: mcp-b
      name: '@deepseek-ai/dsh-mcp-client'
`
    expect(() => pruneEntryOperations(shared, 'mcp-a')).toThrow(/also targets mcp-b/u)
  })

  it('refuses a malformed entry id', () => {
    expect(() => pruneEntryOperations(FILE, 'mcp github')).toThrow(/invalid entry id/u)
  })

  it('removes the only operation and leaves a valid empty list', () => {
    const single = `# only one
- insert:
    - id: mcp-solo
      name: '@deepseek-ai/dsh-mcp-client'
`
    const result = pruneEntryOperations(single, 'mcp-solo')
    expect(result.ops).toBe(1)
    expect(result.text.trim()).toBe('')
  })
})
