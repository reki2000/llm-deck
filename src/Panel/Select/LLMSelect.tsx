// src/Panel/LLMSelect.tsx
import { MenuItem, TextField } from "@mui/material"
import { InstalledLLMs } from "../../llm/installed"
import { ModelSelect } from "./ModelSelect"
import { useLLMConfig } from "./useLLMConfig"

interface LLMSelectProps {
  id: string
}

export const LLMSelect: React.FC<LLMSelectProps> = ({ id }) => {
  const { config, updateConfig } = useLLMConfig(id)

  return (
    <>
      <TextField
        select
        label="LLM"
        value={config.llmId}
        onChange={(e) => updateConfig((c) => ({ ...c, llmId: e.target.value, model: "" }))}
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
        onChange={(v) => updateConfig((c) => ({ ...c, model: v }))}
      />
    </>
  )
}
