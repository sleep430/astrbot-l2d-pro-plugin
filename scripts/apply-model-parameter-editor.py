from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]


def update(path: str, transform):
    file = root / path
    source = file.read_text(encoding="utf-8")
    result = transform(source)
    if result == source:
        print(f"unchanged: {path}")
    else:
        file.write_text(result, encoding="utf-8")
        print(f"updated: {path}")


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if new in source:
        return source
    if old not in source:
        raise RuntimeError(f"anchor not found: {label}")
    return source.replace(old, new, 1)


def patch_cubism(source: str) -> str:
    source = replace_once(
        source,
        "export { CubismModelSettingJson, type ICubismModelSetting }\n",
        "export { CubismModelSettingJson, type ICubismModelSetting }\n\nexport interface CubismParameterSnapshotItem {\n  id: string\n  value: number\n  defaultValue: number\n  minimumValue: number\n  maximumValue: number\n  overridden: boolean\n}\n",
        "Cubism parameter snapshot type",
    )
    source = replace_once(
        source,
        "  private viewportHeight: number = 0\n",
        "  private viewportHeight: number = 0\n\n  private parameterOverrides = new Map<string, number>()\n",
        "Cubism override state",
    )
    methods = """  getParameterSnapshot(): CubismParameterSnapshotItem[] {
    if (!this.userModel) return []
    const model = this.userModel.getModel()
    const result: CubismParameterSnapshotItem[] = []
    for (let index = 0; index < model.getParameterCount(); index++) {
      const id = cubismIdToString(model.getParameterId(index))
      const override = this.parameterOverrides.get(id)
      result.push({
        id,
        value: override ?? model.getParameterValueByIndex(index),
        defaultValue: model.getParameterDefaultValue(index),
        minimumValue: model.getParameterMinimumValue(index),
        maximumValue: model.getParameterMaximumValue(index),
        overridden: override !== undefined
      })
    }
    return result
  }

  setParameterOverride(id: string, value: number): number | null {
    if (!this.userModel || !id || !Number.isFinite(value)) return null
    const model = this.userModel.getModel()
    for (let index = 0; index < model.getParameterCount(); index++) {
      if (cubismIdToString(model.getParameterId(index)) !== id) continue
      const clamped = Math.min(
        model.getParameterMaximumValue(index),
        Math.max(model.getParameterMinimumValue(index), value)
      )
      this.parameterOverrides.set(id, clamped)
      model.setParameterValueByIndex(index, clamped)
      return clamped
    }
    return null
  }

  clearParameterOverride(id?: string): void {
    if (id) this.parameterOverrides.delete(id)
    else this.parameterOverrides.clear()
  }

"""
    source = replace_once(
        source,
        "  /**\n   * 更新模型\n   */\n  update(): void {",
        methods + "  /**\n   * 更新模型\n   */\n  update(): void {",
        "Cubism parameter methods",
    )
    source = replace_once(
        source,
        "    // 物理与姿势在全部姿态偏移注入之后求值，使头发/饰品自然跟随\n",
        "    // 参数编辑器覆盖：在动画之后应用，确保实时值不被动作覆盖。\n    for (const [id, value] of this.parameterOverrides) {\n      model.setParameterValueById(this.getParameterIdHandle(id), value)\n    }\n\n    // 物理与姿势在全部姿态偏移注入之后求值，使头发/饰品自然跟随\n",
        "Cubism override application",
    )
    return source


update("src/utils/cubism/CubismModel.ts", patch_cubism)


def patch_canvas(source: str) -> str:
    source = replace_once(
        source,
        "function resetExpression(fadeMs: number = 300) {\n  model?.resetExpression(fadeMs)\n}\n",
        "function resetExpression(fadeMs: number = 300) {\n  model?.resetExpression(fadeMs)\n}\n\nfunction getParameterSnapshot() {\n  return model?.getParameterSnapshot() ?? []\n}\n\nfunction setParameterOverride(id: string, value: number) {\n  return model?.setParameterOverride(id, value) ?? null\n}\n\nfunction clearParameterOverride(id?: string) {\n  model?.clearParameterOverride(id)\n}\n",
        "Canvas parameter methods",
    )
    return replace_once(
        source,
        "  resetExpression,\n",
        "  resetExpression,\n  getParameterSnapshot,\n  setParameterOverride,\n  clearParameterOverride,\n",
        "Canvas expose",
    )


update("src/components/Live2D/Canvas.vue", patch_canvas)


def patch_ipc(source: str) -> str:
    source = replace_once(
        source,
        "const logger = createScopedLogger('ipc.modelPreview')\n",
        "const logger = createScopedLogger('ipc.modelPreview')\nlet parameterRequestSequence = 0\n",
        "IPC sequence",
    )
    handlers = """  ipcMain.handle('model:getParameters', async () => {
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

"""
    return replace_once(
        source,
        "export function registerModelPreviewHandlers() {\n",
        "export function registerModelPreviewHandlers() {\n" + handlers,
        "parameter IPC handlers",
    )


update("electron/ipc/modelPreview.ts", patch_ipc)


def patch_preload(source: str) -> str:
    additions = """    getParameters: () => ipcRenderer.invoke('model:getParameters'),
    setParameter: (payload: { id: string; value: number }) =>
      ipcRenderer.invoke('model:setParameter', payload),
    clearParameter: (id?: string) => ipcRenderer.invoke('model:clearParameter', { id }),
    onGetParameters: (callback: (payload: { requestId: string }) => void) =>
      subscribeIpc('model:getParameters', callback),
    replyParameters: (payload: { requestId: string; parameters: any[] }) =>
      ipcRenderer.send('model:parameterSnapshot', payload),
    onSetParameter: (callback: (payload: { id: string; value: number }) => void) =>
      subscribeIpc('model:setParameter', callback),
    onClearParameter: (callback: (payload: { id?: string }) => void) =>
      subscribeIpc('model:clearParameter', callback),
"""
    return replace_once(
        source,
        "    captureThumbnail: () => ipcRenderer.invoke('model:captureThumbnail'),\n",
        "    captureThumbnail: () => ipcRenderer.invoke('model:captureThumbnail'),\n" + additions,
        "preload parameter API",
    )


update("electron/preload.ts", patch_preload)


def patch_types(source: str) -> str:
    anchor = """        captureThumbnail: () => Promise<{
          success: boolean
          dataUrl?: string
          error?: string
        }>
"""
    additions = """        getParameters: () => Promise<{
          success: boolean
          parameters?: Array<{
            id: string
            value: number
            defaultValue: number
            minimumValue: number
            maximumValue: number
            overridden: boolean
          }>
          error?: string
        }>
        setParameter: (payload: { id: string; value: number }) => Promise<{ success: boolean; error?: string }>
        clearParameter: (id?: string) => Promise<{ success: boolean; error?: string }>
        onGetParameters: (callback: (payload: { requestId: string }) => void) => Unsubscribe
        replyParameters: (payload: { requestId: string; parameters: any[] }) => void
        onSetParameter: (callback: (payload: { id: string; value: number }) => void) => Unsubscribe
        onClearParameter: (callback: (payload: { id?: string }) => void) => Unsubscribe
"""
    return replace_once(source, anchor, anchor + additions, "Electron type API")


update("src/types/electron.d.ts", patch_types)


def patch_main(source: str) -> str:
    additions = """  mainWindowDisposers.push(
    window.electron.model.onGetParameters(({ requestId }) => {
      window.electron.model.replyParameters({
        requestId,
        parameters: live2dCanvasRef.value?.getParameterSnapshot() ?? []
      })
    })
  )
  mainWindowDisposers.push(
    window.electron.model.onSetParameter(({ id, value }) => {
      live2dCanvasRef.value?.setParameterOverride(id, value)
    })
  )
  mainWindowDisposers.push(
    window.electron.model.onClearParameter(({ id }) => {
      live2dCanvasRef.value?.clearParameterOverride(id)
    })
  )

"""
    anchor = "  mainWindowDisposers.push(\n    window.electron.model.onPreviewMotion(payload => {\n"
    return replace_once(source, anchor, additions + anchor, "main window parameter listeners")


update("src/windows/Main.vue", patch_main)


def patch_menu(source: str) -> str:
    source = replace_once(source, "  | 'library'\n", "  | 'library'\n  | 'parameters'\n", "parameter menu type")
    return replace_once(
        source,
        "      { key: 'library', icon: Sparkles }\n",
        "      { key: 'library', icon: Sparkles },\n      { key: 'parameters', icon: SlidersHorizontal }\n",
        "parameter menu item",
    )


update("src/windows/settings/settingsMenu.ts", patch_menu)


def patch_registry(source: str) -> str:
    entry = """    'model/parameters': {
      key: 'model/parameters',
      group: 'model',
      child: 'parameters',
      layoutProfile: 'workspace',
      cachePolicy: 'discard',
      skeletonKind: 'list',
      loader: () => import('./sections/SettingsModelParametersSection.vue')
    },
"""
    return replace_once(source, "    'model/library': {\n", entry + "    'model/library': {\n", "parameter registry")


update("src/windows/settings/settingsRegistry.ts", patch_registry)

component = r'''<template>
  <SettingsPageScaffold>
    <template #actions>
      <n-space>
        <n-button :loading="loading" @click="refresh">刷新</n-button>
        <n-button :disabled="!parameters.some(item => item.overridden)" @click="resetAll">
          全部恢复
        </n-button>
      </n-space>
    </template>

    <div class="parameter-toolbar">
      <n-input v-model:value="keyword" clearable placeholder="搜索参数 ID" />
      <span class="parameter-count">{{ filteredParameters.length }} / {{ parameters.length }}</span>
    </div>

    <n-alert v-if="error" type="error" :show-icon="true">{{ error }}</n-alert>
    <n-empty
      v-else-if="!loading && parameters.length === 0"
      description="主窗口尚未加载 Live2D 模型"
    />

    <div v-else class="parameter-list">
      <article v-for="item in filteredParameters" :key="item.id" class="parameter-row">
        <div class="parameter-row__head">
          <code>{{ item.id }}</code>
          <span>{{ format(item.minimumValue) }} ～ {{ format(item.maximumValue) }}</span>
        </div>
        <div class="parameter-row__controls">
          <input
            class="parameter-slider"
            type="range"
            :min="item.minimumValue"
            :max="item.maximumValue"
            :step="stepFor(item)"
            :value="item.value"
            @input="updateValue(item, Number(($event.target as HTMLInputElement).value))"
          />
          <n-input-number
            :value="item.value"
            :min="item.minimumValue"
            :max="item.maximumValue"
            :step="stepFor(item)"
            size="small"
            @update:value="value => value !== null && updateValue(item, value)"
          />
          <n-button size="small" :disabled="!item.overridden" @click="reset(item)">恢复</n-button>
        </div>
        <div class="parameter-row__foot">
          <span>默认 {{ format(item.defaultValue) }}</span>
          <span v-if="item.overridden" class="parameter-overridden">实时覆盖中</span>
        </div>
      </article>
    </div>
  </SettingsPageScaffold>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SettingsPageScaffold from '../shared/SettingsPageScaffold.vue'

type ParameterItem = {
  id: string
  value: number
  defaultValue: number
  minimumValue: number
  maximumValue: number
  overridden: boolean
}

const parameters = ref<ParameterItem[]>([])
const keyword = ref('')
const loading = ref(false)
const error = ref('')

const filteredParameters = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return query
    ? parameters.value.filter(item => item.id.toLowerCase().includes(query))
    : parameters.value
})

function format(value: number) {
  return Number(value.toFixed(4)).toString()
}

function stepFor(item: ParameterItem) {
  return Math.max((item.maximumValue - item.minimumValue) / 500, 0.001)
}

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    const result = await window.electron.model.getParameters()
    if (!result.success) throw new Error(result.error || '无法读取模型参数')
    parameters.value = result.parameters ?? []
  } catch (cause: any) {
    error.value = cause?.message || String(cause)
  } finally {
    loading.value = false
  }
}

function updateValue(item: ParameterItem, value: number) {
  const clamped = Math.min(item.maximumValue, Math.max(item.minimumValue, value))
  item.value = clamped
  item.overridden = true
  void window.electron.model.setParameter({ id: item.id, value: clamped })
}

function reset(item: ParameterItem) {
  item.value = item.defaultValue
  item.overridden = false
  void window.electron.model.clearParameter(item.id)
  window.setTimeout(refresh, 60)
}

function resetAll() {
  void window.electron.model.clearParameter()
  window.setTimeout(refresh, 60)
}

onMounted(refresh)
</script>

<style scoped>
.parameter-toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 420px) auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.parameter-count {
  color: var(--text-color-3);
  font-variant-numeric: tabular-nums;
}
.parameter-list {
  display: grid;
  gap: 10px;
  padding-bottom: 24px;
}
.parameter-row {
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-color);
}
.parameter-row__head,
.parameter-row__foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
.parameter-row__head code {
  font-weight: 650;
  color: var(--text-color-1);
  word-break: break-all;
}
.parameter-row__head span,
.parameter-row__foot {
  color: var(--text-color-3);
  font-size: 12px;
}
.parameter-row__controls {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 140px auto;
  gap: 12px;
  align-items: center;
  margin: 12px 0 8px;
}
.parameter-slider {
  width: 100%;
  accent-color: var(--primary-color);
}
.parameter-overridden {
  color: var(--primary-color);
  font-weight: 600;
}
@media (max-width: 720px) {
  .parameter-row__controls {
    grid-template-columns: 1fr 120px;
  }
  .parameter-row__controls button {
    grid-column: 1 / -1;
  }
}
</style>
'''
(root / "src/windows/settings/sections/SettingsModelParametersSection.vue").write_text(component, encoding="utf-8")


def patch_locale(source: str, label: str, description: str) -> str:
    source = replace_once(
        source,
        "  'settings.menu.model.library':",
        f"  'settings.menu.model.parameters': '{label}',\n  'settings.menu.model.library':",
        f"{label} menu locale",
    )
    closing = "\n}\n\nexport default en" if "export default en" in source else "\n}\n"
    addition = f"  'settings.page.model.parameters.desc': '{description}',\n"
    if addition not in source:
        index = source.rfind(closing)
        if index < 0:
            raise RuntimeError("locale closing anchor not found")
        before = source[:index].rstrip()
        if not before.endswith(","):
            before += ","
        source = before + "\n" + addition.rstrip("\n") + source[index:]
    return source


update(
    "src/i18n/locales/zh-CN.ts",
    lambda source: patch_locale(source, "模型参数", "实时查看并调整当前 Live2D 模型的全部 Cubism 参数。"),
)
update(
    "src/i18n/locales/en.ts",
    lambda source: patch_locale(
        source,
        "Model Parameters",
        "Inspect and adjust all Cubism parameters of the current Live2D model in real time.",
    ),
)

package_file = root / "package.json"
package_data = json.loads(package_file.read_text(encoding="utf-8"))
package_data["version"] = "1.1.1"
package_file.write_text(json.dumps(package_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

lock_file = root / "package-lock.json"
lock_data = json.loads(lock_file.read_text(encoding="utf-8"))
lock_data["version"] = "1.1.1"
if "" in lock_data.get("packages", {}):
    lock_data["packages"][""]["version"] = "1.1.1"
lock_file.write_text(json.dumps(lock_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

readme_feature = """

### Live2D 模型参数编辑器

在 **设置 → 模型 → 模型参数** 中可实时搜索、查看和调整当前模型的全部 Cubism 参数。编辑值会立即应用到主窗口模型，并可单项或全部恢复为动画驱动状态。
"""
update("README.md", lambda source: source if "Live2D 模型参数编辑器" in source else source + readme_feature)

readme_en_feature = """

### Live2D Model Parameter Editor

Open **Settings → Model → Model Parameters** to search, inspect, and adjust every Cubism parameter of the active model in real time. Overrides can be cleared individually or all at once to return control to motions, expressions, gaze, and lip sync.
"""
update("README.en.md", lambda source: source if "Live2D Model Parameter Editor" in source else source + readme_en_feature)

changelog_entry = """## [1.1.1] - 2026-07-10

### Added

- 新增 Live2D 模型参数配置页，可实时搜索、调整并恢复全部 Cubism 参数。
- 新增设置窗口与主窗口之间的参数快照及实时覆盖 IPC。

"""
update("CHANGELOG.md", lambda source: source if "## [1.1.1]" in source else changelog_entry + source)

release_notes = """# L2D Pro v1.1.1

## 新增

- 新增 **设置 → 模型 → 模型参数** 页面。
- 自动枚举当前 Live2D 模型的全部 Cubism 参数、默认值与取值范围。
- 支持按参数 ID 搜索、滑杆/数值框实时调整。
- 支持单项恢复和全部恢复，恢复后重新交由动作、表情、视线与口型驱动。

## 技术改进

- 增加设置窗口与主窗口之间的参数快照、实时覆盖 IPC。
- 参数覆盖在每帧动画计算后应用，避免被动作或表情覆盖。
- 参数值会按模型声明的最小值和最大值自动裁剪。

## 验证

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm exec vite build`
"""
(root / "RELEASE_NOTES_v1.1.1.md").write_text(release_notes, encoding="utf-8")


def patch_release_workflow(source: str) -> str:
    source = source.replace(
        "            $version = '1.1.0'",
        "            $version = (Get-Content package.json -Raw | ConvertFrom-Json).version",
    )
    source = source.replace(
        '          "tag=v$version" >> $env:GITHUB_OUTPUT',
        '          "tag=v$version" >> $env:GITHUB_OUTPUT\n          $notesFile = "RELEASE_NOTES_v$version.md"\n          if (-not (Test-Path $notesFile)) { $notesFile = "CHANGELOG.md" }\n          "notes_file=$notesFile" >> $env:GITHUB_OUTPUT',
    )
    source = source.replace(
        "--notes-file RELEASE_NOTES_v1.1.md",
        '--notes-file "${{ steps.version.outputs.notes_file }}"',
    )
    return source


update(".github/workflows/release.yml", patch_release_workflow)

print("model parameter editor migration complete")
