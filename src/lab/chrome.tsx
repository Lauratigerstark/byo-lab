import { MoonIcon, SunIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoute, useTheme } from './hooks'

export function Label({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground uppercase">[ {children} ]</span>
}

export function Hint({ label, keys, children }: { label: string; keys: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        {label} <Kbd>{keys}</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}

const destinations = [
  { page: 'system', href: '#/system', label: 'System' },
  { page: 'evolution', href: '#/designevolution', label: 'Design evolution' },
] as const

export function LabHeader({ children }: { children?: ReactNode }) {
  const { page } = useRoute()
  return (
    <header className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-8 pt-8 pb-8">
      <h1 className="text-[15px] font-semibold tracking-[-0.01em]">
        <a href="#/" onClick={() => scrollTo(0, 0)} className="rounded-chip outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          Lab
        </a>
      </h1>
      {children}
      <nav aria-label="Lab pages" className="ml-auto flex items-center gap-2">
        {destinations.map((destination) => (
          <Button key={destination.page} asChild variant="ghost" className={page === destination.page ? 'bg-muted' : 'text-muted-foreground'}>
            <a href={destination.href} aria-current={page === destination.page ? 'page' : undefined} onClick={() => scrollTo(0, 0)}>
              {destination.label}
            </a>
          </Button>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <Hint label={dark ? 'Light theme' : 'Dark theme'} keys="T">
      <Button variant="outline" size="icon" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
        {dark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </Hint>
  )
}
