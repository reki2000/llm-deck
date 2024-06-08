// src/hooks/useLLMConfig.ts
import { useState } from "react"
import { LoadedPanelConfig, loadPanelConfig, savePanelConfig } from "../panelConfigUtils"

export const useLLMConfig = (id: string) => {
  const [config, setConfig] = useState<LoadedPanelConfig>(() => loadPanelConfig(id))

  const updateConfig = (fn: (c: LoadedPanelConfig) => LoadedPanelConfig) => {
    setConfig(() => savePanelConfig(id, fn))
  }

  return { config, updateConfig }
}
