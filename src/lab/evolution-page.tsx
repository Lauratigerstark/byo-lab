import { CheckIcon, SlidersHorizontalIcon, XIcon, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { findSpecimen } from '@/specimens'
import { LabHeader } from './chrome'
import { ledger, type LedgerEntry } from './design-docs'

type Filter = LedgerEntry['kind'] | 'all'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'changed', label: 'Changes' },
  { value: 'kept', label: 'Kept' },
  { value: 'tossed', label: 'Tossed' },
]

const icons: Record<LedgerEntry['kind'], LucideIcon> = { changed: SlidersHorizontalIcon, kept: CheckIcon, tossed: XIcon }

const longDate = (date: string) => new Date(`${date}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function Title({ entry }: { entry: LedgerEntry }) {
  if (entry.kind === 'changed') return <span className="text-title font-medium text-pretty">{entry.text}</span>
  const specimen = findSpecimen(entry.subject)
  if (!specimen) return <span className="text-title font-medium">{entry.subject}</span>
  return (
    <a href={`#/s/${entry.subject}`} className="w-fit rounded-chip text-title font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
      {specimen.name}
    </a>
  )
}

function Entry({ entry }: { entry: LedgerEntry }) {
  const Icon = icons[entry.kind]
  const detail = entry.kind === 'changed' ? entry.why : entry.text
  return (
    <li className="group/entry relative flex gap-4 pb-6 last:pb-0">
      <span aria-hidden className="absolute top-8 bottom-0 left-4 w-px -translate-x-1/2 bg-border group-last/entry:hidden" />
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-muted-foreground shadow-raised">
        <Icon className="size-4" />
        <span className="sr-only">{entry.kind}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Title entry={entry} />
          {entry.kind === 'changed' && <Badge variant="outline">{entry.subject}</Badge>}
        </div>
        {detail && (
          <p className="text-body text-pretty text-muted-foreground">
            {entry.kind === 'changed' && <span className="font-medium text-foreground">Why: </span>}
            {detail}
          </p>
        )}
        {entry.shot && (
          <a href={entry.shot} target="_blank" rel="noreferrer" className="mt-2 block overflow-hidden rounded-control shadow-raised outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <img src={entry.shot} alt={`The gallery after this ${entry.subject} change`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
          </a>
        )}
      </div>
    </li>
  )
}

export function EvolutionPage() {
  const [filter, setFilter] = useState<Filter>(() => (sessionStorage.getItem('evolution') as Filter | null) ?? 'all')
  const choose = (next: string) => {
    if (!next) return
    sessionStorage.setItem('evolution', next)
    setFilter(next as Filter)
  }
  const shown = ledger.filter((entry) => filter === 'all' || entry.kind === filter)
  const days = [...new Set(shown.map((entry) => entry.date))]

  return (
    <div className="min-h-dvh">
      <LabHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-8 pb-16">
        <div className="flex max-w-[640px] flex-wrap items-center justify-between gap-4 px-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-title font-medium">Design evolution</h2>
            <span className="text-meta text-muted-foreground tabular">{ledger.length} · newest first</span>
          </div>
          <ToggleGroup type="single" variant="segmented" size="sm" spacing={0} value={filter} onValueChange={choose} aria-label="Filter history">
            {filters.map(({ value, label }) => (
              <ToggleGroupItem key={value} value={value} className="px-3">
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {days.length ? (
          days.map((day) => (
            <section key={day} className="flex max-w-[640px] flex-col gap-4">
              <h3 className="px-2 text-meta text-muted-foreground tabular">{longDate(day)}</h3>
              <ol className="flex flex-col px-2">
                {shown
                  .filter((entry) => entry.date === day)
                  .map((entry) => (
                    <Entry key={`${entry.kind}-${entry.subject}-${entry.text}`} entry={entry} />
                  ))}
              </ol>
            </section>
          ))
        ) : (
          <p className="max-w-[640px] px-2 text-body text-muted-foreground">Nothing here yet. Keeps, tosses, and design changes land here as they happen.</p>
        )}
      </main>
    </div>
  )
}
