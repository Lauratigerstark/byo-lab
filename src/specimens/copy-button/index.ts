import type { Specimen } from '@/specimens'
import { CopyButton } from './copy-button'

export const specimen: Specimen = {
  slug: 'copy-button',
  kind: 'component',
  name: 'Copy button',
  hint: 'click copy',
  idea: 'A copy button that shows the exact text it put on your clipboard, so you never wonder what you grabbed.',
  width: 480,
  height: 320,
  films: ['copy-button'],
  Component: CopyButton,
  draft: { date: '2026-11-03', ingredients: [] },
}
