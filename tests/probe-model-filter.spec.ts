import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { registerModelProbe } from '../src/probe-model-filter.ts'
import { mountHarness } from './harness.ts'

describe('Claude probe availability', () => {
  it('follows the admitted provider on each turn and preserves other MCP tools', async () => {
    const { ctx, agent } = await mountHarness()
    try {
      const definitions = ['mcp_probe', 'mcp_search', 'shell'].map(name => ({
        name, description: name, parameters: { type: 'object' as const, properties: {} },
        output: { schema: { type: 'string' as const }, render: (_args: unknown, value: string) => [{ type: 'text' as const, text: value }] },
        async execute() { return 'ok' },
      }))
      const dispose = registerModelProbe(ctx, definitions[0]!)
      for (const definition of definitions.slice(1)) ctx.effect(() => ctx.tools.register(definition))
      let provider = 'claude'
      const names = async () => {
        const admitted = await ctx.tools.resolve({ agent, modelSelection: { provider, model: 'test' }, signal: new AbortController().signal })
        try { return ctx.tools.schemas(agent, admitted).map(tool => tool.name) }
        finally { admitted.dispose() }
      }
      expect(await names()).toEqual(['mcp_search', 'shell'])
      provider = 'subscriptions-claude'
      expect(await names()).toEqual(['mcp_search', 'shell'])
      provider = 'codex'
      expect(await names()).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      provider = 'deepseek'
      expect(await names()).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      provider = 'claude'
      expect(await names()).toEqual(['mcp_search', 'shell'])
      expect(ctx.tools.schemas(agent).map(tool => tool.name)).toEqual(['mcp_probe', 'mcp_search', 'shell'])
      dispose()
      provider = 'deepseek'
      expect(await names()).toEqual(['mcp_search', 'shell'])
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
