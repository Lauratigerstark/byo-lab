import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

export const SHOTS = 'docs/ledger'

// Screenshots the gallery (every specimen and draft) as it looks in the working tree, so a ledger line shows the lab after the change.
export async function snapshotGallery(root, name) {
  mkdirSync(resolve(root, SHOTS), { recursive: true })
  let file = `${SHOTS}/${name}.png`
  for (let n = 2; existsSync(resolve(root, file)); n++) file = `${SHOTS}/${name}-${n}.png`

  const server = await createServer({ root, logLevel: 'error', server: { port: 5193 } })
  await server.listen()
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }))
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' })
    await page.goto(server.resolvedUrls.local[0])
    await page.waitForSelector('main')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: resolve(root, file), fullPage: true })
  } finally {
    await browser.close()
    await server.close()
  }
  return file
}
