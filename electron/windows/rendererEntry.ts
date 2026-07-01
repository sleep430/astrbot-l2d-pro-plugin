import { app, shell, type BrowserWindow } from 'electron'
import path from 'path'

export type RendererEntryName = 'main' | 'settings' | 'welcome'

const RENDERER_DEV_SERVER_URL = 'http://localhost:5173/'
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])
const guardedWindows = new WeakSet<BrowserWindow>()

export function isRendererDevMode(): boolean {
  return process.env.NODE_ENV === 'development' || !app.isPackaged
}

export function isTrustedRendererUrl(rawUrl: string): boolean {
  try {
    const parsedUrl = new URL(rawUrl)
    if (parsedUrl.protocol === 'file:') {
      return true
    }

    if (!isRendererDevMode()) {
      return false
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false
    }

    return parsedUrl.origin === new URL(RENDERER_DEV_SERVER_URL).origin
  } catch {
    return false
  }
}

function toSafeExternalUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string') {
    return null
  }

  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl) {
    return null
  }

  try {
    const parsedUrl = new URL(trimmedUrl)
    return ALLOWED_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol) ? parsedUrl.toString() : null
  } catch {
    return null
  }
}

function openExternalIfAllowed(rawUrl: unknown): void {
  const safeUrl = toSafeExternalUrl(rawUrl)
  if (!safeUrl) {
    return
  }

  void shell.openExternal(safeUrl).catch(error => {
    console.warn('[navigation] Failed to open external URL:', error)
  })
}

export function installRendererNavigationGuards(window: BrowserWindow): void {
  if (guardedWindows.has(window)) {
    return
  }

  guardedWindows.add(window)

  window.webContents.on('will-navigate', (event, url) => {
    if (isTrustedRendererUrl(url)) {
      return
    }

    event.preventDefault()
    openExternalIfAllowed(url)
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalIfAllowed(url)
    return { action: 'deny' }
  })
}

export function loadRendererEntry(
  window: BrowserWindow,
  entryName: RendererEntryName
): Promise<void> {
  installRendererNavigationGuards(window)

  if (isRendererDevMode()) {
    return window.loadURL(new URL(`${entryName}.html`, RENDERER_DEV_SERVER_URL).toString())
  }

  return window.loadFile(path.join(app.getAppPath(), 'dist', `${entryName}.html`))
}
