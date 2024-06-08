// src/Panel/ModelSelect.tsx
import { CircularProgress, MenuItem, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { llmProvider } from "../../llm/llm"
import { useModels } from "./useModels"

interface ModelSelectProps {
  llm: llmProvider
  credential: string
  defaultModel: string
  onChange: (model: string) => void
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  llm,
  credential,
  defaultModel,
  onChange,
}) => {
  const { models, loading } = useModels(llm, credential)
  const [model, setModel] = useState(defaultModel)

  useEffect(() => {
    if (models.length === 0) {
      return
    }
    const selectedModel = models.includes(defaultModel)
      ? defaultModel
      : models.includes(llm.defaultModel)
        ? llm.defaultModel
        : models[0] || ""
    if (selectedModel !== defaultModel) {
      setModel(selectedModel)
      onChange(selectedModel)
    }
  }, [models, onChange, llm.defaultModel, models[0]])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <TextField
      select
      label={llm.name}
      value={model}
      onChange={(e) => {
        const value = e.target.value || ""
        setModel(value)
        onChange(value)
      }}
    >
      {models.map((model) => (
        <MenuItem key={model} value={model}>
          {model}
        </MenuItem>
      ))}
    </TextField>
  )
}
