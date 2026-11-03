import { Fragment, type ReactNode } from 'react'
import { LabHeader } from './chrome'
import { colors, corners, docSections, easings, elevations, typeRoles, type DocSection, type Token } from './design-docs'
import { useTheme } from './hooks'

const useValue = () => {
  const { dark } = useTheme()
  return (token: Token) => (dark ? token.dark : token.light)
}

function Section({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2 px-2">
        <h2 className="text-title font-medium">{title}</h2>
        <span className="text-meta text-muted-foreground">{note}</span>
      </div>
      {children}
    </section>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-surface bg-card p-6 shadow-raised">{children}</div>
}

function TokenName({ name, value }: { name: string; value: string }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-mono text-meta">{name}</span>
      <span title={value} className="truncate font-mono text-meta text-muted-foreground">
        {value}
      </span>
    </span>
  )
}

function Colors() {
  const value = useValue()
  return (
    <Panel>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,272px),1fr))] gap-x-6 gap-y-4">
        {colors.map((token) => (
          <div key={token.name} className="flex items-center gap-2">
            <span aria-hidden className="size-8 shrink-0 rounded-control shadow-hairline" style={{ background: `var(--${token.name})` }} />
            <TokenName name={token.name} value={value(token)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Type() {
  const value = useValue()
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        {typeRoles.map((token) => (
          <div key={token.name} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-32 shrink-0">
              <TokenName name={`text-${token.name.replace('type-', '')}`} value={value(token)} />
            </span>
            <span className="min-w-0 text-pretty" style={{ fontSize: `var(--${token.name})` }}>
              Copied the invite link for Northwind, expires in 7 days
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Corners() {
  const value = useValue()
  return (
    <Panel>
      <div className="grid grid-cols-3 gap-4">
        {corners.map((token) => (
          <div key={token.name} className="flex min-w-0 flex-col gap-2">
            <span aria-hidden className="h-16 bg-muted shadow-hairline" style={{ borderRadius: `var(--${token.name})` }} />
            <TokenName name={`rounded-${token.name.replace('corner-', '')}`} value={value(token)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Elevation() {
  return (
    <div className="rounded-surface bg-canvas p-6 shadow-inset">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,160px),1fr))] gap-6">
        {elevations.map((token) => (
          <div key={token.name} className="grid h-20 place-items-center rounded-control bg-card px-2 font-mono text-meta" style={{ boxShadow: `var(--${token.name})` }}>
            <span className="truncate">{`shadow-${token.name.replace('elevation-', '')}`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Easing() {
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        {easings.map(({ name, value }) => {
          const [x1, y1, x2, y2] = (value.match(/-?[\d.]+/g) ?? []).map(Number)
          return (
            <div key={name} className="flex items-center gap-4">
              <svg aria-hidden viewBox="-2 -2 36 36" className="size-8 shrink-0 overflow-visible text-muted-foreground">
                <path d={`M0 32 C${x1 * 32} ${32 - y1 * 32} ${x2 * 32} ${32 - y2 * 32} 32 0`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <TokenName name={name} value={value} />
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function Inline({ text }: { text: string }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('`')) return <code key={index} className="font-mono text-meta text-foreground">{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <strong key={index} className="font-medium text-foreground">{part.slice(2, -2)}</strong>
    return <Fragment key={index}>{part}</Fragment>
  })
}

function Rule({ line }: { line: string }) {
  const item = line.match(/^(?:-|\d+\.) (.*)$/)
  if (!item) return <p className="text-pretty"><Inline text={line} /></p>
  return (
    <li className="ml-4 list-disc text-pretty marker:text-faint">
      <Inline text={item[1]} />
    </li>
  )
}

function Rules({ sections }: { sections: DocSection[] }) {
  return (
    <Panel>
      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="text-title font-medium">{section.title}</h3>
            <ul className="flex flex-col gap-2 text-body text-muted-foreground">
              {section.lines.map((line) => (
                <Rule key={line} line={line} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function SystemPage() {
  return (
    <div className="min-h-dvh">
      <LabHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-12 px-8 pb-16">
        <Section title="Color" note={`from src/index.css, ${colors.length} tokens`}>
          <Colors />
        </Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-6">
          <Section title="Type" note="one size per role">
            <Type />
          </Section>
          <Section title="Radius" note="nested radii derive from these">
            <Corners />
          </Section>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:gap-6">
          <Section title="Elevation" note="depth comes from these, not borders">
            <Elevation />
          </Section>
          <Section title="Easing" note="curves used by motion">
            <Easing />
          </Section>
        </div>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-6">
          <Section title="Taste" note="from TASTE.md">
            <Rules sections={docSections('TASTE.md')} />
          </Section>
          <Section title="Grid" note="from GRID.md">
            <Rules sections={docSections('GRID.md')} />
          </Section>
        </div>
      </main>
    </div>
  )
}
