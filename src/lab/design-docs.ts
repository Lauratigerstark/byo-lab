import css from '@/index.css?raw'

const docs = import.meta.glob<string>(['/TASTE.md', '/GRID.md', '/LEDGER.md'], { query: '?raw', import: 'default', eager: true })

export type Token = { name: string; light: string; dark: string }

const block = (selector: string) => {
  const start = css.search(new RegExp(`^${selector} \\{$`, 'm'))
  return start < 0 ? '' : css.slice(start, css.indexOf('\n}', start))
}

const declarations = (source: string) => Object.fromEntries([...source.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map((match) => [match[1], match[2].replace(/\s+/g, ' ').trim()]))

const light = declarations(block(':root'))
const dark = declarations(block('\\.dark'))
const theme = declarations(block('@theme inline'))

const tokens = Object.entries(light).map(([name, value]): Token => ({ name, light: value, dark: dark[name] ?? value }))
const prefixed = (prefix: string) => tokens.filter((token) => token.name.startsWith(prefix))

export const colors = tokens.filter((token) => /^(oklch|var)\(/.test(token.light) && !token.name.startsWith('elevation-'))
export const corners = prefixed('corner-')
export const typeRoles = prefixed('type-')
export const elevations = prefixed('elevation-')
export const easings = Object.entries(theme).flatMap(([name, value]) => (name.startsWith('ease-') ? [{ name, value }] : []))

export type DocSection = { title: string; lines: string[] }

export function docSections(file: 'TASTE.md' | 'GRID.md') {
  const sections: DocSection[] = []
  for (const line of (docs[`/${file}`] ?? '').split('\n')) {
    if (line.startsWith('## ')) sections.push({ title: line.slice(3), lines: [] })
    else if (line.trim()) sections.at(-1)?.lines.push(line.trim())
  }
  return sections
}

export type LedgerEntry = { date: string; kind: 'changed' | 'kept' | 'tossed'; subject: string; text: string; why?: string }

export const ledger = (docs['/LEDGER.md'] ?? '')
  .split('\n')
  .flatMap((line): LedgerEntry[] => {
    const match = line.match(/^- (\d{4}-\d{2}-\d{2}) (changed|kept|tossed) `([^`]+)`(?: \([^)]*\))?(?:: (.*))?$/)
    if (!match) return []
    const [, date, kind, subject, rest = ''] = match
    const [text, why] = rest.split(' Why: ')
    return [{ date, kind: kind as LedgerEntry['kind'], subject, text, why }]
  })
  .reverse()
