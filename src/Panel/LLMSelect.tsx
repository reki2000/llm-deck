import { MenuItem, TextField } from "@mui/material"
import { useState } from "react"

import { loadConfig, saveConfig } from "../configurations"
import { InstalledLLMs } from "../llm/installed"
import { llmProvider } from "../llm/llm"
import { ModelSelect } from "./ModelSelect"

type PanelConfig = {
  id: string
  llmId: string
  model: string
}

type LoadedPanelConfig = {
  llm: llmProvider
  credential: string
} & PanelConfig

export const loadPanelConfig = (panelId: string) => {
  const config = JSON.parse(
    loadConfig("panel", panelId) || `{"id":${panelId} ,"llmId":"openai","model":""}`,
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

export const LLMSelect = ({ id }: { id: string }) => {
  const [config, setConfig] = useState(() => loadPanelConfig(id))

  const savePanelConfig = (fn: (c: LoadedPanelConfig) => LoadedPanelConfig) => {
    setConfig((c) => {
      const { llm, credential, ...save } = fn(c)
      saveConfig("panel", id, JSON.stringify(save))
      return loadPanelConfig(id)
    })
  }

  return (
    <>
      <TextField
        select
        label="LLM"
        value={config.llmId}
        onChange={(e) => savePanelConfig((c) => ({ ...c, llmId: e.target.value, model: "" }))}
      >
        {InstalledLLMs.map((llm) => (
          <MenuItem key={llm.name} value={llm.id}>
            {llm.name}
          </MenuItem>
        ))}
      </TextField>
      <ModelSelect
        llm={config.llm}
        credential={config.credential}
        defaultModel={config.model}
        onChange={(v) => savePanelConfig((c) => ({ ...c, model: v }))}
      />
    </>
  )
}
