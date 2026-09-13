/**
 * Removing one server's operations from the profile patch layer.
 *
 * Everything else in this console appends: an edit, a disable, an enable are
 * all new operations layered over earlier ones ([write](./write.ts)). A real
 * delete cannot be expressed that way — the loader's patch vocabulary has no
 * remove, so the entry's operations have to leave the file. This module owns
 * that one rewrite, and it is deliberately conservative:
 *
 * - it deletes WHOLE LINES and nothing else, so every surviving byte is the
 *   byte that was there before;
 * - it only deletes lines inside spans it classified as belonging to the
 *   named entry id, plus the comment block immediately above each span;
 * - it refuses the whole operation when a span would take another entry's
 *   `id:` line with it, when nothing matched, or when the result is not a
 *   strict line-subsequence of the input.
 *
 * The grammar it reads is the one the loader accepts and this console writes:
 * a top-level YAML sequence whose items start at column 0 with `- `, each
 * item being an `insert` list, a block override row, or a one-line flow row.
 *
 * Pure module: no I/O.
 *
 * @module dsh-mcp-panel/prune
 */

/** One removable region of the patch file, in line indices `[start, end)`. */
interface Span {
  readonly start: number
  readonly end: number
}

/** What a prune would do, before any file is touched. */
export interface PruneResult {
  /** The file text with the entry's operations removed. */
  readonly text: string
  /** How many top-level operations were removed. */
  readonly ops: number
  /** How many lines were removed, comments included. */
  readonly lines: number
}

/** Why a prune was refused. */
export class PruneRefusal extends Error {
  constructor(message: string) {
    super(`dsh-mcp-panel: ${message}`)
    this.name = 'PruneRefusal'
  }
}

/** Whether a line opens a top-level sequence item. */
function isItemStart(line: string): boolean {
  return line.startsWith('- ')
}

/** Whether a line is a top-level comment or blank (both attach to what follows). */
function isLeadIn(line: string): boolean {
  return line.startsWith('#') || line.trim() === ''
}

/** The `id:` value a line declares, at any indent, or null. */
function declaredId(line: string): string | null {
  const block = /^\s*-?\s*id:\s*(['"]?)([A-Za-z0-9_-]+)\1\s*$/u.exec(line)
  if (block !== null) return block[2] ?? null
  const flow = /^\s*-\s*\{\s*id:\s*(['"]?)([A-Za-z0-9_-]+)\1\s*[,}]/u.exec(line)
  return flow === null ? null : (flow[2] ?? null)
}

/**
 * Split the document into top-level items, each carrying the comment/blank
 * block that immediately precedes it.
 *
 * @param lines - the file's lines.
 * @returns one span per item, in order.
 */
function itemSpans(lines: readonly string[]): Span[] {
  const spans: Span[] = []
  let index = 0
  while (index < lines.length) {
    if (!isItemStart(lines[index] ?? '')) { index += 1; continue }
    let start = index
    // Walk back over the contiguous comment block, stopping at the blank line
    // that separates it from the previous item (that blank stays with us).
    let cursor = index - 1
    let seenComment = false
    while (cursor >= 0 && isLeadIn(lines[cursor] ?? '')) {
      const blank = (lines[cursor] ?? '').trim() === ''
      if (blank && seenComment) break
      if (!blank) seenComment = true
      start = cursor
      cursor -= 1
    }
    let end = index + 1
    while (end < lines.length && !isItemStart(lines[end] ?? '') && !isLeadIn(lines[end] ?? '')) end += 1
    spans.push({ start, end })
    index = end
  }
  return spans
}

/** Every id an item mentions, in order. */
function idsOf(lines: readonly string[], span: Span): string[] {
  const ids: string[] = []
  for (let index = span.start; index < span.end; index += 1) {
    const id = declaredId(lines[index] ?? '')
    if (id !== null) ids.push(id)
  }
  return ids
}

/**
 * Remove every operation that targets one entry id.
 *
 * @param text - current patch-file contents.
 * @param entryId - loader entry id to erase, e.g. `mcp-github`.
 * @returns the pruned text plus what was removed.
 * @throws PruneRefusal when nothing matched, when an operation also carries
 *   another entry's id, or when the result would not be a line-subsequence.
 */
export function pruneEntryOperations(text: string, entryId: string): PruneResult {
  if (!/^[A-Za-z0-9_-]+$/u.test(entryId)) throw new PruneRefusal(`invalid entry id ${JSON.stringify(entryId)}`)
  const lines = text.split('\n')
  const doomed: Span[] = []
  for (const span of itemSpans(lines)) {
    const ids = idsOf(lines, span)
    if (!ids.includes(entryId)) continue
    const others = ids.filter(id => id !== entryId)
    if (others.length > 0) {
      throw new PruneRefusal(
        `the operation at line ${span.start + 1} also targets ${others.join(', ')} — remove ${entryId} from it by hand`,
      )
    }
    doomed.push(span)
  }
  if (doomed.length === 0) throw new PruneRefusal(`no operation in the patch layer targets ${entryId}`)

  const removed = new Set<number>()
  for (const span of doomed) for (let index = span.start; index < span.end; index += 1) removed.add(index)
  const kept = lines.filter((_line, index) => !removed.has(index))

  // Guard: keeping only whole lines means the survivors must still appear in
  // the original, in order. A mismatch means the span walk went wrong.
  let cursor = 0
  for (const line of kept) {
    while (cursor < lines.length && lines[cursor] !== line) cursor += 1
    if (cursor === lines.length) throw new PruneRefusal('the pruned text is not a line-subsequence of the original — refusing to write')
    cursor += 1
  }

  const joined = kept.join('\n').replace(/\n{3,}/gu, '\n\n')
  return {
    text: joined.endsWith('\n') ? joined : `${joined}\n`,
    ops: doomed.length,
    lines: removed.size,
  }
}
