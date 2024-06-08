import { loadConfig, saveConfig } from "../configurations"
// src/utils/configUtils.ts
import { InstalledLLMs } from "../llm/installed"
import { llmProvider } from "../llm/llm"

export type PanelConfig = {
  id: string
  llmId: string
  model: string
}

export type LoadedPanelConfig = {
  llm: llmProvider
  credential: string
} & PanelConfig

export const loadPanelConfig = (panelId: string): LoadedPanelConfig => {
  const config = JSON.parse(
    loadConfig("panel", panelId) || `{"id":"${panelId}","llmId":"openai","model":""}`,
  ) as PanelConfig

  console.log("loadPanelConfig", config)
  const llm = InstalledLLMs.find((l) => l.id === config.llmId) || InstalledLLMs[0]
  const credential = loadConfig("config", llm.id) || llm.localApiKey

  return {
    llm,
    credential,
    ...config,
    model: config.model || llm.defaultModel,
  }
}

export const savePanelConfig = (
  id: string,
  fn: (c: LoadedPanelConfig) => LoadedPanelConfig,
): LoadedPanelConfig => {
  const currentConfig = loadPanelConfig(id)
  const { llm, credential, ...save } = fn(currentConfig)
  saveConfig("panel", id, JSON.stringify(save))
  return loadPanelConfig(id)
}
