<template>
  <SettingsPageScaffold>
    <SettingsSubsection>
      <template #actions>
        <span class="status-pill" :class="currentModelStatusClass">
          {{ currentModelStatusLabel }}
        </span>
      </template>

      <template v-if="currentModelPath">
        <div class="current-model-info">
          <div class="current-model-info__preview" :style="themeSwatchStyle">
            <span>{{ currentModelInitial }}</span>
          </div>
          <div class="current-model-info__meta">
            <strong>{{ currentModelDisplay }}</strong>
            <span class="current-model-info__color">{{ sourceColor.toUpperCase() }}</span>
            <code class="settings-inline-path">{{ currentModelPath }}</code>
          </div>
        </div>
      </template>
      <n-empty v-else :description="$t('settings.model.current.notLoaded')" />
    </SettingsSubsection>

    <SettingsSubsection
      :title="$t('settings.model.current.behavior')"
      :description="$t('settings.model.current.behaviorDesc')"
    >
      <template v-if="currentModelPath">
        <n-form label-placement="top">
          <n-form-item :label="$t('settings.model.current.idleActivity')">
            <n-space align="center" style="width: 100%">
              <n-slider
                :value="currentModelBehavior.idleActivity"
                :min="0"
                :max="1"
                :step="0.05"
                :format-tooltip="formatIdleActivity"
                style="width: 200px"
                @update:value="handleIdleActivityChange"
              />
              <span class="idle-activity-value">{{
                formatIdleActivity(currentModelBehavior.idleActivity)
              }}</span>
            </n-space>
            <template #feedback>
              {{ $t('settings.model.current.idleActivityFeedback') }}
            </template>
          </n-form-item>
          <n-form-item :label="$t('settings.model.current.persistentExpressions')">
            <NSelect
              multiple
              clearable
              filterable
              size="small"
              :options="expressionOptions"
              :value="currentModelBehavior.persistentExpressions"
              :placeholder="$t('settings.model.current.persistentExpressionsPlaceholder')"
              @update:value="handlePersistentExpressionsChange"
            />
            <template #feedback>
              {{ $t('settings.model.current.persistentExpressionsFeedback') }}
            </template>
          </n-form-item>
        </n-form>
      </template>
      <n-empty v-else :description="$t('settings.model.current.notLoaded')" />
    </SettingsSubsection>

    <SettingsSubsection
      title="桌面点击交互"
      description="兼容 Live2DViewerEX 常见的 Head/Body 点击区域；模型没有 HitAreas 时会按模型上半部分和下半部分兜底。"
    >
      <template v-if="currentModelPath">
        <n-form label-placement="top">
          <div class="click-settings-inline">
            <n-form-item label="启用点击交互">
              <NSwitch v-model:value="clickSettings.enabled" />
            </n-form-item>
            <n-form-item label="无配置时使用首个动作/表情">
              <NSwitch v-model:value="clickSettings.fallbackToFirst" />
            </n-form-item>
            <n-form-item label="显示触发提示">
              <NSwitch v-model:value="clickSettings.showToast" />
            </n-form-item>
          </div>

          <div class="click-settings-inline click-settings-inline--numbers">
            <n-form-item label="冷却时间">
              <n-input-number
                :value="clickSettings.cooldownMs"
                :min="0"
                :max="60000"
                :step="100"
                size="small"
                @update:value="(value: number | null) => (clickSettings.cooldownMs = value ?? 0)"
              >
                <template #suffix>ms</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="表情淡入">
              <n-input-number
                :value="clickSettings.fadeMs"
                :min="0"
                :max="5000"
                :step="50"
                size="small"
                @update:value="(value: number | null) => (clickSettings.fadeMs = value ?? 0)"
              >
                <template #suffix>ms</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="动作优先级">
              <n-input-number
                :value="clickSettings.priority"
                :min="0"
                :max="5"
                :step="1"
                size="small"
                @update:value="(value: number | null) => (clickSettings.priority = value ?? 2)"
              />
            </n-form-item>
          </div>

          <div class="click-settings-inline click-settings-inline--numbers">
            <n-form-item label="表情自动回归">
              <NSwitch v-model:value="clickSettings.expressionAutoReturnEnabled" />
            </n-form-item>
            <n-form-item label="保持时间">
              <n-input-number
                :value="clickSettings.expressionAutoReturnSeconds"
                :min="0.1"
                :max="120"
                :step="0.5"
                size="small"
                @update:value="
                  (value: number | null) => (clickSettings.expressionAutoReturnSeconds = value ?? 3)
                "
              >
                <template #suffix>s</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="回归淡出">
              <n-input-number
                :value="clickSettings.expressionReturnFadeMs"
                :min="0"
                :max="5000"
                :step="50"
                size="small"
                @update:value="
                  (value: number | null) => (clickSettings.expressionReturnFadeMs = value ?? 300)
                "
              >
                <template #suffix>ms</template>
              </n-input-number>
            </n-form-item>
          </div>

          <div class="click-zone-grid">
            <section class="click-zone-panel">
              <div class="click-zone-panel__header">
                <strong>头部</strong>
                <NSwitch v-model:value="clickSettings.headEnabled" size="small" />
              </div>
              <n-form-item label="动作组">
                <NSelect
                  clearable
                  filterable
                  size="small"
                  :options="motionGroupOptions"
                  :value="clickSettings.headMotionGroup"
                  @update:value="value => setClickMotionGroup('head', value as string | null)"
                />
              </n-form-item>
              <n-form-item label="动作序号">
                <n-input-number
                  :value="clickSettings.headMotionIndex"
                  :min="0"
                  :max="999"
                  :step="1"
                  size="small"
                  @update:value="
                    (value: number | null) => (clickSettings.headMotionIndex = value ?? 0)
                  "
                />
              </n-form-item>
              <n-form-item label="表情">
                <NSelect
                  clearable
                  filterable
                  size="small"
                  :options="expressionOptionsWithEmpty"
                  :value="clickSettings.headExpression"
                  @update:value="value => setClickExpression('head', value as string | null)"
                />
              </n-form-item>
              <NButton size="small" secondary @click="previewClickZone('head')">测试头部</NButton>
            </section>

            <section class="click-zone-panel">
              <div class="click-zone-panel__header">
                <strong>身体</strong>
                <NSwitch v-model:value="clickSettings.bodyEnabled" size="small" />
              </div>
              <n-form-item label="动作组">
                <NSelect
                  clearable
                  filterable
                  size="small"
                  :options="motionGroupOptions"
                  :value="clickSettings.bodyMotionGroup"
                  @update:value="value => setClickMotionGroup('body', value as string | null)"
                />
              </n-form-item>
              <n-form-item label="动作序号">
                <n-input-number
                  :value="clickSettings.bodyMotionIndex"
                  :min="0"
                  :max="999"
                  :step="1"
                  size="small"
                  @update:value="
                    (value: number | null) => (clickSettings.bodyMotionIndex = value ?? 0)
                  "
                />
              </n-form-item>
              <n-form-item label="表情">
                <NSelect
                  clearable
                  filterable
                  size="small"
                  :options="expressionOptionsWithEmpty"
                  :value="clickSettings.bodyExpression"
                  @update:value="value => setClickExpression('body', value as string | null)"
                />
              </n-form-item>
              <NButton size="small" secondary @click="previewClickZone('body')">测试身体</NButton>
            </section>
          </div>
        </n-form>
      </template>
      <n-empty v-else :description="$t('settings.model.current.notLoaded')" />
    </SettingsSubsection>

    <SettingsSubsection
      :title="$t('settings.model.current.preferences')"
      :description="$t('settings.model.current.preferencesDesc')"
    >
      <n-form label-placement="top">
        <n-form-item :label="$t('settings.model.current.scale')">
          <n-space align="center" style="width: 100%">
            <n-slider
              :value="currentModelScaleValue"
              :min="0.1"
              :max="5.0"
              :step="0.05"
              style="width: 200px"
              @update:value="handleModelScaleChange"
            />
            <n-input-number
              :value="currentModelScaleValue"
              :min="0.1"
              :max="5.0"
              :step="0.05"
              size="small"
              style="width: 110px"
              @update:value="(value: number | null) => handleModelScaleChange(value || 1.0)"
            >
              <template #suffix>x</template>
            </n-input-number>
            <NButton size="small" @click="handleResetModelScale">{{
              $t('settings.model.current.resetScale')
            }}</NButton>
          </n-space>
        </n-form-item>
        <n-form-item :label="$t('settings.model.current.themeFollowModel')">
          <NSwitch
            v-model:value="advancedSettings.themeFollowModel"
            @update:value="handleThemeFollowChange"
          />
          <template #feedback>
            {{ $t('settings.model.current.themeFollowFeedback') }}
          </template>
        </n-form-item>
      </n-form>

      <div class="settings-kv-list">
        <div class="settings-kv-list__row">
          <span>{{ $t('settings.model.current.currentThemeColor') }}</span>
          <span class="theme-color-control">
            <span class="theme-color-swatch" :style="{ backgroundColor: sourceColor }"></span>
            <strong>{{ sourceColor.toUpperCase() }}</strong>
            <input
              type="color"
              :value="sourceColor"
              class="theme-color-picker"
              :aria-label="$t('settings.model.current.pickColor')"
              @input="handleColorPick"
            />
            <NButton v-if="manualColorOverride" size="tiny" secondary @click="handleResetAutoColor">
              {{ $t('settings.model.current.resetAutoColor') }}
            </NButton>
          </span>
        </div>
        <div class="settings-kv-list__row">
          <span>{{ $t('settings.model.current.syncStatus') }}</span>
          <strong>{{ syncStatusLabel }}</strong>
        </div>
      </div>
    </SettingsSubsection>

    <SettingsSubsection
      :title="$t('settings.modelConfig.motions')"
      :description="$t('settings.modelConfig.motionsDesc')"
    >
      <template #actions>
        <NButton v-if="currentModelPath" size="small" @click="autoGenerateAliases">
          {{ $t('settings.modelConfig.autoGenerate') }}
        </NButton>
      </template>

      <template v-if="currentModelPath">
        <p v-if="motionAliases.length" class="model-alias-table-hint">
          {{ $t('settings.modelConfig.motionCount', { count: motionAliases.length }) }}
        </p>
        <div class="model-alias-table-wrap">
          <n-data-table
            :columns="motionColumns"
            :data="motionAliases"
            :pagination="false"
            :single-line="false"
            :bordered="false"
            striped
            max-height="400px"
          />
        </div>
      </template>
      <n-empty v-else :description="$t('settings.model.current.notLoaded')" />
    </SettingsSubsection>

    <SettingsSubsection
      :title="$t('settings.modelConfig.expressions')"
      :description="$t('settings.modelConfig.expressionsDesc')"
    >
      <template v-if="currentModelPath">
        <div class="model-alias-table-wrap">
          <n-data-table
            :columns="expressionColumns"
            :data="expressionAliases"
            :pagination="false"
            :single-line="false"
            :bordered="false"
            striped
            max-height="300px"
          />
        </div>
      </template>
      <n-empty v-else :description="$t('settings.model.current.notLoaded')" />
    </SettingsSubsection>

    <SettingsSubsection v-if="currentModelPath">
      <n-space>
        <NButton type="primary" :loading="saving" @click="saveConfig">
          {{ $t('settings.modelConfig.save') }}
        </NButton>
        <NButton @click="loadConfig">
          {{ $t('settings.modelConfig.reload') }}
        </NButton>
        <NButton @click="captureModelThumbnail">
          {{ $t('settings.modelConfig.captureThumbnail') }}
        </NButton>
      </n-space>
    </SettingsSubsection>
  </SettingsPageScaffold>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, h } from 'vue'
import { NButton, NInput, NSelect, NSwitch, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import SettingsPageScaffold from '../shared/SettingsPageScaffold.vue'
import SettingsSubsection from '../shared/SettingsSubsection.vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useAdvancedSettingsDomain } from '../domains/createAdvancedSettingsDomain'
import { useModelSettingsDomain } from '../domains/createModelSettingsDomain'
import {
  buildModelConfigFromCatalog,
  generateExpressionAliasFromId,
  generateMotionAliasFromId,
  type ModelCatalogPayload
} from '@/shared/modelConfigFactory'
import { mergeAliasConfigWithCatalog, parseMotionIdParts } from '@/shared/modelAliasMerge'

const { t } = useI18n()
const message = useMessage()
const { advancedSettings, handleThemeFollowChange } = useAdvancedSettingsDomain()
const {
  currentModelDisplay,
  currentModelInitial,
  currentModelPath,
  currentModelScaleValue,
  currentModelStatusClass,
  currentModelStatusLabel,
  currentModelBehavior,
  handleIdleActivityChange,
  handlePersistentExpressionsChange,
  handleModelScaleChange,
  handleResetModelScale,
  sourceColor,
  themeSwatchStyle
} = useModelSettingsDomain()

const themeStore = useThemeStore()
const { manualColorOverride } = storeToRefs(themeStore)

const saving = ref(false)
const motionAliases = ref<any[]>([])
const expressionAliases = ref<any[]>([])

const LIVE2D_CLICK_INTERACTION_SETTINGS_KEY = 'live2d_click_interaction_settings'

type Live2DClickZone = 'head' | 'body'

type Live2DClickSettings = {
  enabled: boolean
  headEnabled: boolean
  bodyEnabled: boolean
  headMotionGroup: string
  headMotionIndex: number
  headExpression: string
  bodyMotionGroup: string
  bodyMotionIndex: number
  bodyExpression: string
  cooldownMs: number
  fadeMs: number
  priority: number
  expressionAutoReturnEnabled: boolean
  expressionAutoReturnSeconds: number
  expressionReturnFadeMs: number
  showToast: boolean
  fallbackToFirst: boolean
  headRatio: number
}

function createDefaultClickSettings(): Live2DClickSettings {
  return {
    enabled: false,
    headEnabled: true,
    bodyEnabled: true,
    headMotionGroup: '',
    headMotionIndex: 0,
    headExpression: '',
    bodyMotionGroup: '',
    bodyMotionIndex: 0,
    bodyExpression: '',
    cooldownMs: 800,
    fadeMs: 200,
    priority: 2,
    expressionAutoReturnEnabled: true,
    expressionAutoReturnSeconds: 3,
    expressionReturnFadeMs: 300,
    showToast: false,
    fallbackToFirst: true,
    headRatio: 0.45
  }
}

function finiteNumber(value: unknown, fallback: number, min: number, max: number) {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(max, Math.max(min, numeric))
}

function normalizeClickSettings(value: unknown): Live2DClickSettings {
  const defaults = createDefaultClickSettings()
  const source = value && typeof value === 'object' ? (value as Partial<Live2DClickSettings>) : {}
  return {
    ...defaults,
    ...source,
    enabled: Boolean(source.enabled ?? defaults.enabled),
    headEnabled: Boolean(source.headEnabled ?? defaults.headEnabled),
    bodyEnabled: Boolean(source.bodyEnabled ?? defaults.bodyEnabled),
    headMotionGroup: String(source.headMotionGroup ?? defaults.headMotionGroup),
    headMotionIndex: Math.floor(finiteNumber(source.headMotionIndex, defaults.headMotionIndex, 0, 999)),
    headExpression: String(source.headExpression ?? defaults.headExpression),
    bodyMotionGroup: String(source.bodyMotionGroup ?? defaults.bodyMotionGroup),
    bodyMotionIndex: Math.floor(finiteNumber(source.bodyMotionIndex, defaults.bodyMotionIndex, 0, 999)),
    bodyExpression: String(source.bodyExpression ?? defaults.bodyExpression),
    cooldownMs: Math.floor(finiteNumber(source.cooldownMs, defaults.cooldownMs, 0, 60000)),
    fadeMs: Math.floor(finiteNumber(source.fadeMs, defaults.fadeMs, 0, 5000)),
    priority: Math.floor(finiteNumber(source.priority, defaults.priority, 0, 5)),
    expressionAutoReturnEnabled: Boolean(
      source.expressionAutoReturnEnabled ?? defaults.expressionAutoReturnEnabled
    ),
    expressionAutoReturnSeconds: finiteNumber(
      source.expressionAutoReturnSeconds,
      defaults.expressionAutoReturnSeconds,
      0.1,
      120
    ),
    expressionReturnFadeMs: Math.floor(
      finiteNumber(source.expressionReturnFadeMs, defaults.expressionReturnFadeMs, 0, 5000)
    ),
    showToast: Boolean(source.showToast ?? defaults.showToast),
    fallbackToFirst: Boolean(source.fallbackToFirst ?? defaults.fallbackToFirst),
    headRatio: finiteNumber(source.headRatio, defaults.headRatio, 0.1, 0.9)
  }
}

function loadClickSettings(): Live2DClickSettings {
  try {
    const raw = localStorage.getItem(LIVE2D_CLICK_INTERACTION_SETTINGS_KEY)
    return normalizeClickSettings(raw ? JSON.parse(raw) : null)
  } catch (error) {
    console.warn('[设置] 读取 Live2D 点击交互配置失败:', error)
    return createDefaultClickSettings()
  }
}

const clickSettings = ref<Live2DClickSettings>(loadClickSettings())

function persistClickSettings() {
  const normalized = normalizeClickSettings(clickSettings.value)
  localStorage.setItem(LIVE2D_CLICK_INTERACTION_SETTINGS_KEY, JSON.stringify(normalized))
  window.dispatchEvent(new StorageEvent('storage', { key: LIVE2D_CLICK_INTERACTION_SETTINGS_KEY }))
}

function handleColorPick(event: Event) {
  const input = event.target as HTMLInputElement
  if (input?.value) {
    themeStore.setManualColor(input.value)
  }
}

function handleResetAutoColor() {
  themeStore.resetToAutoColor()
}

function formatIdleActivity(value: number) {
  return `${Math.round(value * 100)}%`
}

const syncStatusLabel = computed(() => {
  if (!advancedSettings.value.themeFollowModel) {
    return t('settings.model.current.syncDisabled')
  }
  return currentModelPath.value
    ? t('settings.model.current.followingModel')
    : t('settings.model.current.waitingForModel')
})

const expressionOptions = computed(() =>
  expressionAliases.value.map(row => ({
    label: row.name || row.id,
    value: row.id
  }))
)

const expressionOptionsWithEmpty = computed(() => [
  { label: '不触发表情', value: '' },
  ...expressionOptions.value
])

const motionGroupOptions = computed(() => {
  const groups = new Set<string>()
  for (const row of motionAliases.value) {
    const { group } = parseMotionIdParts(row.id)
    if (group) {
      groups.add(group)
    }
  }
  return [
    { label: '不触发动作', value: '' },
    ...Array.from(groups).map(group => ({ label: group, value: group }))
  ]
})

function setClickMotionGroup(zone: Live2DClickZone, value: string | null) {
  if (zone === 'head') {
    clickSettings.value.headMotionGroup = value || ''
  } else {
    clickSettings.value.bodyMotionGroup = value || ''
  }
}

function setClickExpression(zone: Live2DClickZone, value: string | null) {
  if (zone === 'head') {
    clickSettings.value.headExpression = value || ''
  } else {
    clickSettings.value.bodyExpression = value || ''
  }
}

async function previewClickZone(zone: Live2DClickZone) {
  const settings = normalizeClickSettings(clickSettings.value)
  const motionGroup = zone === 'head' ? settings.headMotionGroup : settings.bodyMotionGroup
  const motionIndex = zone === 'head' ? settings.headMotionIndex : settings.bodyMotionIndex
  const expression = zone === 'head' ? settings.headExpression : settings.bodyExpression
  let triggered = false

  if (motionGroup) {
    const result = await window.electron.model.previewMotion({
      group: motionGroup,
      index: motionIndex,
      priority: settings.priority,
      loop: false
    })
    triggered = true
    if (!result.success) {
      message.warning(result.error || t('settings.modelConfig.previewFailed'))
    }
  }

  if (expression) {
    const result = await window.electron.model.previewExpression({
      id: expression,
      holdMs: settings.expressionAutoReturnEnabled
        ? Math.max(1, Math.round(settings.expressionAutoReturnSeconds * 1000))
        : 2500,
      resetPolicy: 'neutral',
      fade: settings.fadeMs,
      fadeOut: settings.expressionReturnFadeMs
    })
    triggered = true
    if (!result.success) {
      message.warning(result.error || t('settings.modelConfig.previewFailed'))
    }
  }

  if (!triggered) {
    message.info('先为这个区域选择动作或表情')
  }
}

async function previewMotionRow(row: { id: string }) {
  const { group, index } = parseMotionIdParts(row.id)
  const result = await window.electron.model.previewMotion({
    group,
    index,
    priority: 2,
    loop: false
  })
  if (!result.success) {
    message.warning(result.error || t('settings.modelConfig.previewFailed'))
  }
}

async function previewExpressionRow(row: { id: string }) {
  const result = await window.electron.model.previewExpression({
    id: row.id,
    holdMs: 2500,
    resetPolicy: 'neutral',
    fade: 200
  })
  if (!result.success) {
    message.warning(result.error || t('settings.modelConfig.previewFailed'))
  }
}

async function captureModelThumbnail() {
  const result = await window.electron.model.captureThumbnail()
  if (!result.success || !result.dataUrl) {
    message.warning(result.error || t('settings.modelConfig.thumbnailFailed'))
    return
  }
  message.success(t('settings.modelConfig.thumbnailCaptured'))
  console.log('[别名配置] 缩略图 dataUrl 长度:', result.dataUrl.length)
}

const motionColumns = computed<DataTableColumns<any>>(() => [
  {
    key: 'enabled',
    title: t('settings.modelConfig.enabled'),
    width: 80,
    render: row => h(NSwitch, { value: row.enabled, onUpdateValue: v => (row.enabled = v) })
  },
  { key: 'id', title: t('settings.modelConfig.motionId'), width: 120 },
  {
    key: 'name',
    title: t('settings.modelConfig.alias'),
    width: 150,
    render: row => h(NInput, { value: row.name, onUpdateValue: v => (row.name = v), size: 'small' })
  },
  {
    key: 'category',
    title: t('settings.modelConfig.category'),
    width: 120,
    render: row =>
      h(NSelect, {
        value: row.category,
        onUpdateValue: v => (row.category = v),
        options: [
          { label: t('settings.modelConfig.idle'), value: 'idle' },
          { label: t('settings.modelConfig.action'), value: 'action' }
        ],
        size: 'small'
      })
  },
  {
    key: 'description',
    title: t('settings.modelConfig.description'),
    render: row =>
      h(NInput, {
        value: row.description,
        onUpdateValue: v => (row.description = v),
        size: 'small'
      })
  },
  {
    key: 'preview',
    title: t('settings.modelConfig.preview'),
    width: 90,
    render: row =>
      h(
        NButton,
        { size: 'tiny', secondary: true, onClick: () => void previewMotionRow(row) },
        { default: () => t('settings.modelConfig.preview') }
      )
  }
])

const expressionColumns = computed<DataTableColumns<any>>(() => [
  {
    key: 'enabled',
    title: t('settings.modelConfig.enabled'),
    width: 80,
    render: row => h(NSwitch, { value: row.enabled, onUpdateValue: v => (row.enabled = v) })
  },
  { key: 'id', title: t('settings.modelConfig.expressionId'), width: 120 },
  {
    key: 'name',
    title: t('settings.modelConfig.alias'),
    width: 150,
    render: row => h(NInput, { value: row.name, onUpdateValue: v => (row.name = v), size: 'small' })
  },
  {
    key: 'description',
    title: t('settings.modelConfig.description'),
    render: row =>
      h(NInput, {
        value: row.description,
        onUpdateValue: v => (row.description = v),
        size: 'small'
      })
  },
  {
    key: 'preview',
    title: t('settings.modelConfig.preview'),
    width: 90,
    render: row =>
      h(
        NButton,
        { size: 'tiny', secondary: true, onClick: () => void previewExpressionRow(row) },
        { default: () => t('settings.modelConfig.preview') }
      )
  }
])

async function loadFromModelCatalog() {
  const modelPath = currentModelPath.value
  if (!modelPath) return

  const catalogResult = await window.electron.model.getCatalog(modelPath)
  if (!catalogResult.success || !catalogResult.catalog) {
    console.log('[别名配置] 无法从主进程获取模型目录:', catalogResult.error)
    return
  }

  const config = buildModelConfigFromCatalog(catalogResult.catalog as ModelCatalogPayload)
  motionAliases.value = config.motionAliases
  expressionAliases.value = config.expressionAliases
  console.log(
    '[别名配置] 从模型目录生成:',
    motionAliases.value.length,
    '个动作,',
    expressionAliases.value.length,
    '个表情'
  )
}

async function loadConfig() {
  const modelPath = currentModelPath.value
  if (!modelPath) {
    console.log('[别名配置] 没有当前模型')
    return
  }

  console.log('[别名配置] 开始加载配置:', modelPath)
  try {
    const result = await window.electron.modelConfig.load(modelPath)

    if (result.success && result.config) {
      const catalogResult = await window.electron.model.getCatalog(modelPath)
      if (catalogResult.success && catalogResult.catalog) {
        const merged = mergeAliasConfigWithCatalog(
          result.config,
          catalogResult.catalog as ModelCatalogPayload
        )
        motionAliases.value = merged.motionAliases
        expressionAliases.value = merged.expressionAliases
        console.log(
          '[别名配置] 已合并配置与目录:',
          motionAliases.value.length,
          '动作,',
          expressionAliases.value.length,
          '表情'
        )
      } else {
        motionAliases.value = result.config.motionAliases
        expressionAliases.value = result.config.expressionAliases
      }
    } else {
      console.log('[别名配置] 无配置文件，从模型信息生成')
      await loadFromModelCatalog()
    }
  } catch (error) {
    console.error('[别名配置] 加载失败:', error)
    await loadFromModelCatalog()
  }
}

function autoGenerateAliases() {
  motionAliases.value.forEach(m => {
    if (!m.name || m.name === m.id) {
      m.name = generateMotionAliasFromId(m.id)
    }
  })
  expressionAliases.value.forEach(e => {
    if (!e.name || e.name === e.id) {
      e.name = generateExpressionAliasFromId(e.id)
    }
  })
  message.success(t('settings.modelConfig.generated'))
}

async function saveConfig() {
  const modelPath = currentModelPath.value
  if (!modelPath) return

  saving.value = true
  try {
    const config = {
      modelPath,
      version: '2.0',
      motionAliases: motionAliases.value,
      expressionAliases: expressionAliases.value
    }

    const result = await window.electron.modelConfig.save(config)
    if (result.success) {
      message.success(t('settings.modelConfig.saved'))
    } else {
      message.error(result.error || t('settings.modelConfig.saveFailed'))
    }
  } catch (error: any) {
    message.error(error.message)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  console.log('[别名配置] 组件挂载, currentModelPath:', currentModelPath.value)
  void loadConfig()
})

watch(currentModelPath, newPath => {
  console.log('[别名配置] 模型切换:', newPath)
  void loadConfig()
})

watch(clickSettings, persistClickSettings, { deep: true })
</script>

<style scoped>
.current-model-info {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.current-model-info__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  color: var(--theme-accent-contrast);
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.current-model-info__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.current-model-info__meta strong {
  font-size: 16px;
  line-height: 1.2;
}

.current-model-info__color {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.settings-inline-path {
  display: block;
  padding: 8px 10px;
  border-radius: var(--desktop-radius-control);
  background: var(--settings-bg-surface);
  border: 1px solid var(--desktop-panel-border);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  white-space: pre-wrap;
  word-break: break-all;
}

.click-settings-inline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
  align-items: end;
}

.click-settings-inline--numbers {
  margin-top: 4px;
}

.click-zone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 8px;
}

.click-zone-panel {
  padding: 12px;
  border: 1px solid var(--desktop-panel-border);
  border-radius: var(--desktop-radius-control);
  background: var(--settings-bg-surface);
}

.click-zone-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.click-zone-panel__header strong {
  font-size: 13px;
}

.click-zone-panel :deep(.n-form-item) {
  margin-bottom: 10px;
}

.expression-type-alert {
  margin-bottom: 12px;
}

.idle-activity-value {
  min-width: 40px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.model-alias-table-hint {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.model-alias-table-wrap {
  /* 外框与表色见 settings-shell.scss，随浅色/深色 --settings-* 切换 */
}

.model-alias-table-wrap :deep(.n-data-table-th),
.model-alias-table-wrap :deep(.n-data-table-td) {
  font-size: 12px;
}

.model-alias-table-wrap :deep(.n-input),
.model-alias-table-wrap :deep(.n-base-selection) {
  --n-color: var(--settings-control-bg);
  --n-border: 1px solid var(--settings-control-border);
}

.expression-type-groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.expression-type-group h3 {
  margin: 0 0 10px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.expression-type-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.expression-type-row {
  display: grid;
  grid-template-columns: minmax(86px, 0.34fr) minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--desktop-panel-border);
  border-radius: var(--desktop-radius-control);
  background: rgba(255, 255, 255, 0.02);
}

.expression-type-row__meta {
  min-width: 0;
}

.expression-type-row__meta strong,
.expression-type-row__meta code {
  display: block;
}

.expression-type-row__meta strong {
  margin-bottom: 3px;
  font-size: 13px;
}

.expression-type-row__meta code {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 10px;
  word-break: break-all;
}

.theme-color-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-color-swatch {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.theme-color-picker {
  width: 28px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}

.theme-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.theme-color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}
</style>
