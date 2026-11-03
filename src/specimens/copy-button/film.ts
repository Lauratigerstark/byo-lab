import type { Scene } from '@/film/scenes'

export const video = { width: 1440, height: 960, fps: 60 }

export const theme = {
  dark: false,
  vars: {} as Record<string, string>,
  motion: { glide: '0.645, 0.045, 0.355, 1', settle: '0.23, 1, 0.32, 1', drawer: '0.32, 0.72, 0, 1', press: '0.4, 0, 1, 1', linear: '0, 0, 1, 1' } as Record<string, string>,
  sound: { volume: 0.5 },
}

export const storyboard: Scene[] = [
  {
    id: 'main',
    type: 'specimen',
    specimen: 'copy-button',
    duration: 6,
    values: { shown: 0 },
    beats: [
      { at: 1.4, click: '[data-slot="trigger"]', values: { shown: 1 }, over: 0.18, ease: 'settle' },
      { at: 4.8, values: { shown: 0 }, over: 0.18, ease: 'settle' },
    ],
  },
]
