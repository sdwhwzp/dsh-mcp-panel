import { describe, expect, it } from 'vitest'
import { MCP_PANEL_INVOCATIONS } from '../src/wire.ts'

describe('Harness codec factories', () => {
  it('validates every RPC input and result with the same schema on both Host generations', () => {
    for (const descriptor of MCP_PANEL_INVOCATIONS) {
      for (const codec of [descriptor.result, ...descriptor.parameters.map(parameter => parameter.codec)]) {
        const schema = codec.create()
        expect(schema).toBe(codec.schema)
        expect(schema.safeParse(null).success).toBe(false)
      }
    }
  })
})
