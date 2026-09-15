/** Claude request compatibility for the optional panel probe tool. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'

/**
 * Omit the probe schema from Claude assemblies before request-header persistence.
 * Other MCP tools and the panel's direct probe action remain available.
 * @param ctx - Plugin context owning the assembly listener.
 * @returns Disposer for the model-specific filter.
 */
export function installProbeModelFilter(ctx: Context): () => void {
  return ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    if (assembled.variables['provider'] !== 'claude') return assembled
    return {
      ...assembled,
      tools: assembled.tools.filter(tool => tool.name !== 'mcp_probe'),
    }
  }, { prepend: true })
}
