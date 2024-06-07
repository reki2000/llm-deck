import { Button, CircularProgress, MenuItem, Stack, TextField } from "@mui/material"

import { Fragment, useEffect, useRef, useState } from "react"
import { InstalledLLMs } from "./llm/installed"
import { llmProvider, llmStreahBreaker as llmStreamBreaker } from "./llm/llm"

import TexMarkdown from "./TexMarkdown"
import { loadConfig, saveConfig } from "./configurations"

import { useResponse } from "./response"
import { SpeechButton } from "./speech/SpeechButton"

const ModelSelect = ({
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
    setModel(defaultModel)
  }, [defaultModel])

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

const ResponseField = ({ text, markdown }: { text: string; markdown: boolean }) => {
  return markdown ? (
    <TexMarkdown>{text}</TexMarkdown>
  ) : (
    text.split("\n").map((item, i, arr) => (
      <Fragment key={item}>
        {item}
        {i < arr.length - 1 && <br />}
      </Fragment>
    ))
  )
}

export type PanelConfig = {
  id: string
  llmId: string
  model: string
}

const loadPanelConfig = (id: string) => {
  return JSON.parse(
    loadConfig("panel", id) || `{"id":${id} ,"llmId":"openai","model":""}`,
  ) as PanelConfig
}

const savePanelConfig = (config: PanelConfig) => {
  saveConfig("panel", config.id, JSON.stringify(config))
}

// LLMPanel is a component that displays the UI of the configurations for a single LLM provider.
// 'sessionID' prop fires the LLM provider to generate the response for the givin prompt and configurations.
export const LLMPanel = ({
  sessionId,
  instruction,
  prompt,
  id,
  onEnd,
  onClose,
}: {
  sessionId: string
  instruction: string
  prompt: string
  id: string
  onEnd: () => void
  onClose: () => void
}) => {
  const [markdown, setMarkdown] = useState(true)

  const [config, setConfig] = useState(loadPanelConfig(id))
  const [llmId, setLlmId] = useState(config.llmId)
  const llm = InstalledLLMs.find((llm) => llm.id === llmId) || InstalledLLMs[0]
  const credential = loadConfig("config", llm.id) || llm.localApiKey

  const [model, setModel] = useState(config.model || llm.defaultModel)

  useEffect(() => {
    savePanelConfig(config)
  }, [config])

  useEffect(() => {
    setConfig((c) => ({ ...c, model }))
  }, [model])

  useEffect(() => {
    setConfig((c) => ({ ...c, llmId }))
  }, [llmId])

  const breaker = useRef<llmStreamBreaker | null>(null)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const { response, working } = useResponse({
    sessionId,
    starter: (onDelta) => {
      const starter = async () => {
        breaker.current = await llm.start(credential, instruction, prompt, onDelta, {
          model: config.model,
        })
      }
      starter()
    },
    onEnd,
  })

  return (
    <>
      <Stack spacing={1} width="100%">
        <Stack direction="row" spacing={1} display="flex" alignItems="center">
          <TextField
            select
            label="LLM"
            value={config.llmId}
            onChange={(e) => setLlmId(e.target.value)}
          >
            {InstalledLLMs.map((llm) => (
              <MenuItem key={llm.name} value={llm.id}>
                {llm.name}
              </MenuItem>
            ))}
          </TextField>
          <ModelSelect
            llm={llm}
            credential={credential}
            defaultModel={config.model}
            // onChange={() => {}}
            onChange={(v) => setModel(v)}
          />
          <Button onClick={() => onClose()}>Close</Button>
        </Stack>
        <Stack direction="row" display="flex" alignItems="center">
          <SpeechButton text={response} working={working} />
          <Button
            onClick={() => {
              setMarkdown((v) => !v)
            }}
          >
            {markdown ? "Text" : "Markdown/Tex"}
          </Button>
        </Stack>
        <ResponseField text={response} markdown={markdown} />
        {working ? "[working...]" : "[completed]"}
      </Stack>
    </>
  )
}
