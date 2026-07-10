<template>
  <SettingsPageScaffold
    ><template #actions
      ><n-space
        ><n-button :loading="loading" @click="refresh">刷新</n-button
        ><n-button :disabled="!parameters.some(i => i.overridden)" @click="resetAll"
          >全部恢复</n-button
        ></n-space
      ></template
    >
    <div class="toolbar">
      <n-input v-model:value="keyword" clearable placeholder="搜索参数 ID" /><span
        >{{ filtered.length }} / {{ parameters.length }}</span
      >
    </div>
    <n-alert v-if="error" type="error">{{ error }}</n-alert
    ><n-empty v-else-if="!loading && !parameters.length" description="主窗口尚未加载 Live2D 模型" />
    <div v-else class="list">
      <article v-for="item in filtered" :key="item.id" class="row">
        <header>
          <code>{{ item.id }}</code
          ><span>{{ fmt(item.minimumValue) }} ～ {{ fmt(item.maximumValue) }}</span>
        </header>
        <div class="controls">
          <input
            type="range"
            :min="item.minimumValue"
            :max="item.maximumValue"
            :step="step(item)"
            :value="item.value"
            @input="update(item, Number(($event.target as HTMLInputElement).value))"
          /><n-input-number
            :value="item.value"
            :min="item.minimumValue"
            :max="item.maximumValue"
            :step="step(item)"
            size="small"
            @update:value="(v: number | null) => v !== null && update(item, v)"
          /><n-button size="small" :disabled="!item.overridden" @click="reset(item)">恢复</n-button>
        </div>
        <footer>
          <span>默认 {{ fmt(item.defaultValue) }}</span
          ><b v-if="item.overridden">实时覆盖中</b>
        </footer>
      </article>
    </div></SettingsPageScaffold
  >
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SettingsPageScaffold from '../shared/SettingsPageScaffold.vue'
type Item = {
  id: string
  value: number
  defaultValue: number
  minimumValue: number
  maximumValue: number
  overridden: boolean
}
const parameters = ref<Item[]>([]),
  keyword = ref(''),
  loading = ref(false),
  error = ref('')
const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return q ? parameters.value.filter(i => i.id.toLowerCase().includes(q)) : parameters.value
})
const fmt = (v: number) => Number(v.toFixed(4)).toString()
const step = (i: Item) => Math.max((i.maximumValue - i.minimumValue) / 500, 0.001)
async function refresh() {
  loading.value = true
  error.value = ''
  try {
    const r = await window.electron.model.getParameters()
    if (!r.success) throw new Error(r.error || '无法读取模型参数')
    parameters.value = r.parameters ?? []
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}
function update(i: Item, v: number) {
  i.value = Math.min(i.maximumValue, Math.max(i.minimumValue, v))
  i.overridden = true
  void window.electron.model.setParameter({ id: i.id, value: i.value })
}
function reset(i: Item) {
  i.value = i.defaultValue
  i.overridden = false
  void window.electron.model.clearParameter(i.id)
  setTimeout(refresh, 60)
}
function resetAll() {
  void window.electron.model.clearParameter()
  setTimeout(refresh, 60)
}
onMounted(refresh)
</script>
<style scoped>
.toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 420px) auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.list {
  display: grid;
  gap: 10px;
  padding-bottom: 24px;
}
.row {
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-color);
}
header,
footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
header code {
  font-weight: 650;
  word-break: break-all;
}
header span,
footer {
  color: var(--text-color-3);
  font-size: 12px;
}
.controls {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 140px auto;
  gap: 12px;
  align-items: center;
  margin: 12px 0 8px;
}
.controls input {
  width: 100%;
  accent-color: var(--primary-color);
}
footer b {
  color: var(--primary-color);
}
@media (max-width: 720px) {
  .controls {
    grid-template-columns: 1fr 120px;
  }
  .controls button {
    grid-column: 1/-1;
  }
}
</style>
