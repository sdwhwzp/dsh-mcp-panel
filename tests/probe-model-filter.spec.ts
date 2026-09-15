import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { installProbeModelFilter } from '../src/probe-model-filter.ts'

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
