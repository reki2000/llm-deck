import { CircularProgress, MenuItem, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { llmProvider } from "../llm/llm"

export const ModelSelect = ({
  llm,
  credential,
  defaultModel,
  onChange,
}: {
  llm: llmProvider
  credential: string
  defaultModel: string
  onChange: (_: string) => void
}) => {
  const [model, setModel] = useState(defaultModel)
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const fetchModels = async () => {
      setModels([])
      const availableModels = await llm.models(credential)
      availableModels.sort()
      setModels(availableModels)
    }

    fetchModels()
  }, [credential, llm])

  useEffect(() => {
    if (models.length === 0) {
      return
    }
    const selectedModel = models.includes(defaultModel)
      ? defaultModel
      : models.includes(llm.defaultModel)
        ? llm.defaultModel
        : models.at(0) || ""
    if (selectedModel !== defaultModel) {
      setModel(selectedModel)
      onChange(selectedModel)
    }
  }, [models, defaultModel, onChange, llm.defaultModel])

  return models.length === 0 || !models.includes(model) ? (
    <CircularProgress />
  ) : (
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
