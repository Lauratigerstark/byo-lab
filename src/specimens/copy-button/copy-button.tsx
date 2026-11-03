import { Check, Copy } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFilmFrame } from '@/film/frame'

const WEBHOOK_URL = 'https://hooks.northwind.dev/v2/endpoints/wh_7Kd2mQ/events?sig=a81f4c9e27b3d06f'
const TAIL_LENGTH = 6
const DURATION = 210
const HOLD = 2000

export function CopyButton({ value = WEBHOOK_URL }: { value?: string }) {
  const film = useFilmFrame()
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    if (film) return
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(value)
      setFailed(false)
      setOpen(true)
      timer.current = window.setTimeout(() => setOpen(false), HOLD)
    } catch {
      // Stays open: the receipt is the only place the full value can be selected by hand.
      setFailed(true)
      setOpen(true)
    }
  }

  const shown = film ? (film.values.shown ?? 0) : open ? 1 : 0
  const copied = shown > 0.5 && !failed
  const offset = reducedMotion ? 0 : (1 - shown) * -8

  return (
    <div className="grid place-items-center" style={{ width: 480, height: 320 }}>
      <div className="flex w-[432px] flex-col gap-4 rounded-surface bg-card p-6 shadow-floating">
        <div className="flex flex-col gap-2">
          <span className="text-title leading-4 font-medium">Webhook URL</span>
          <span className="text-meta leading-4 text-muted-foreground">Sends order events to Northwind.</span>
        </div>
        <div className="relative flex gap-2">
          <div className="flex h-8 min-w-0 flex-1 items-center rounded-control bg-muted px-2 font-mono text-meta shadow-inset">
            {value ? (
              <>
                <span className="min-w-0 truncate">{value.slice(0, -TAIL_LENGTH)}</span>
                <span className="shrink-0">{value.slice(-TAIL_LENGTH)}</span>
              </>
            ) : (
              <span className="font-sans text-muted-foreground">No URL yet</span>
            )}
          </div>
          <Button data-slot="trigger" variant="outline" className="w-[88px] gap-1 px-2" disabled={!value} onClick={copy}>
            {copied ? <Check className="text-signal" /> : <Copy />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <div
            aria-hidden
            className={`absolute top-full right-0 left-0 z-10 mt-2 flex flex-col gap-2 rounded-control bg-popover p-2 shadow-floating ${failed ? 'select-text' : 'pointer-events-none'}`}
            style={{
              opacity: shown,
              transform: `translateY(${offset}px)`,
              visibility: shown > 0 ? 'visible' : 'hidden',
              transition: film ? undefined : `opacity ${DURATION}ms ease-out, transform ${DURATION}ms cubic-bezier(0.23, 1, 0.32, 1), visibility ${DURATION}ms`,
            }}
          >
            <span className={`text-meta leading-4 font-medium ${failed ? 'text-destructive' : 'text-muted-foreground'}`}>
              {failed ? 'Couldn’t reach your clipboard. Select the URL and copy it by hand.' : 'On your clipboard'}
            </span>
            <span className="font-mono text-meta leading-4 break-all">{value}</span>
          </div>
          <span role="status" className="sr-only">
            {open ? (failed ? `Couldn’t copy. The URL is ${value}` : `Copied ${value}`) : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
