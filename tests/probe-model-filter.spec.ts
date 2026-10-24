import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { installProbeModelFilter, registerModelProbe } from '../src/probe-model-filter.ts'

describe('Claude probe availability', () => {
  it('follows the assembled provider on each turn and preserves other MCP tools', async () => {
    const ctx = new Context()
    try {
      await ctx.plugin(SystemPrompt)
      const schemas = ['mcp_probe', 'mcp_search', 'shell'].map(name => ({
        name, description: name, parameters: { type: 'object' as const, properties: {} },
      }))
      ctx.systemPrompt.tools(() => ({ schemas }))
      const dispose = installProbeModelFilter(ctx)
      let provider = 'claude'
      // Model selection supplies the final provider after its delegated assembly.
      ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
        const assembled = await next()
        return { ...assembled, variables: { ...assembled.variables, provider } }
      })
      const names = async () => (await ctx.systemPrompt.assemble()).tools.map(tool => tool.name)
      expect(await names()).toEqual(['mcp_search', 'shell'])
      provider = 'subscriptions-claude'
      expect(await names()).toEqual(['mcp_search', 'shell'])
      provider = 'codex'
      expect(await names()).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      provider = 'deepseek'
      expect(await names()).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      provider = 'claude'
      expect(await names()).toEqual(['mcp_search', 'shell'])
      expect(schemas.map(tool => tool.name)).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      dispose()
      expect(await names()).toEqual(['mcp_probe', 'mcp_search', 'shell'])
    } finally {
      await ctx.fiber.dispose()
    }
  })
})

 it('applies executor admission to both Claude routes and releases its registration', async () => {
   const ctx = new Context()
   let admission: ((input: { modelSelection: { provider: string } }) => boolean) | undefined
   let disposed = false
   ctx.provide('tools', {
     register(_definition: object, options: { when: typeof admission }) {
       admission = options.when
       return () => { disposed = true }
     },
   })
   try {
     const dispose = registerModelProbe(ctx, {
       name: 'mcp_probe', description: 'Probe', parameters: {},
       output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: String(value) }] },
       async execute() { return 'ok' },
     })
     for (const provider of ['claude', 'subscriptions-claude']) expect(admission?.({ modelSelection: { provider } })).toBe(false)
     for (const provider of ['deepseek', 'codex']) expect(admission?.({ modelSelection: { provider } })).toBe(true)
     dispose()
     expect(disposed).toBe(true)
   } finally { await ctx.fiber.dispose() }
 })
