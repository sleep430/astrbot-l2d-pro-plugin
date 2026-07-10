import { ipcMain } from 'electron'
import { getMainWindow } from '../windows/mainWindow'
import { createScopedLogger } from '../utils/logger'

const logger = createScopedLogger('ipc.modelPreview')
let parameterRequestSequence = 0

type PreviewMotionPayload = { group: string; index: number; priority?: number; loop?: boolean }
type PreviewExpressionPayload = {
  id: string
  fade?: number
  fadeOut?: number
  holdMs?: number
  resetPolicy?: 'previous' | 'neutral' | 'keep' | 'fadeOut' | 'default' | 'hold'
}

export function registerModelPreviewHandlers() {
  ipcMain.handle('model:getParameters', async () => {
    const mainWindow = getMainWindow()
    if (!mainWindow) return { success: false, error: 'main window not available' }
    const requestId = `parameter-${Date.now()}-${++parameterRequestSequence}`
    return await new Promise(resolve => {
      const onSnapshot = (_event: Electron.IpcMainEvent, payload: any) => {
        if (payload?.requestId !== requestId) return
        clearTimeout(timeout)
        ipcMain.removeListener('model:parameterSnapshot', onSnapshot)
        resolve({ success: true, parameters: payload.parameters ?? [] })
      }
      const timeout = setTimeout(() => {
        ipcMain.removeListener('model:parameterSnapshot', onSnapshot)
        resolve({ success: false, error: 'parameter request timed out' })
      }, 3000)
      ipcMain.on('model:parameterSnapshot', onSnapshot)
      mainWindow.webContents.send('model:getParameters', { requestId })
    })
  })

  ipcMain.handle('model:setParameter', async (_event, payload: { id: string; value: number }) => {
    const mainWindow = getMainWindow()
    if (!mainWindow) return { success: false, error: 'main window not available' }
    mainWindow.webContents.send('model:setParameter', payload)
    return { success: true }
  })

  ipcMain.handle('model:clearParameter', async (_event, payload?: { id?: string }) => {
    const mainWindow = getMainWindow()
    if (!mainWindow) return { success: false, error: 'main window not available' }
    mainWindow.webContents.send('model:clearParameter', payload ?? {})
    return { success: true }
  })

  ipcMain.handle('model:previewMotion', async (_event, payload: PreviewMotionPayload) => {
    const mainWindow = getMainWindow()
    if (!mainWindow) {
      return { success: false, error: 'main window not available' }
    }
    mainWindow.webContents.send('model:previewMotion', payload)
    logger.debug('preview.motion', payload)
    return { success: true }
  })

  ipcMain.handle('model:previewExpression', async (_event, payload: PreviewExpressionPayload) => {
    const mainWindow = getMainWindow()
    if (!mainWindow) {
      return { success: false, error: 'main window not available' }
    }
    mainWindow.webContents.send('model:previewExpression', payload)
    logger.debug('preview.expression', payload)
    return { success: true }
  })

  ipcMain.handle('model:captureThumbnail', async () => {
    const mainWindow = getMainWindow()
    if (!mainWindow) {
      return { success: false, error: 'main window not available' }
    }
    try {
      const image = await mainWindow.webContents.capturePage()
      const png = image.toPNG()
      const dataUrl = `data:image/png;base64,${png.toString('base64')}`
      return { success: true, dataUrl }
    } catch (error: any) {
      logger.error('preview.thumbnailFailed', error)
      return { success: false, error: error.message }
    }
  })
}
