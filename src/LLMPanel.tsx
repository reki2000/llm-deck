import { Button, MenuItem, Stack, TextField } from "@mui/material"

import { Fragment, useEffect, useRef, useState } from "react"
import { InstalledLLMs, llmProvider, llmStreahBreaker as llmStreamBreaker } from "./llm/llm"

import TexMarkdown from "./TexMarkdown"
import { loadConfiguration, saveConfiguration } from "./configurations"
import { loadCredential } from "./credential"

import { SpeechButton } from "./speech/SpeechButton"

const useResponse = ({
  sessionId,
  starter,
  onEnd,
}: {
  sessionId: string
  starter: (onDelta: (delta: string, done: boolean) => void) => void
  onEnd: () => void
}) => {
  const [response, setResponse] = useState("")
  const [working, setWorking] = useState(false)

  const currentSessionId = useRef("")

  useEffect(() => {
    if (sessionId === "" && currentSessionId.current !== "") {
      onEnd()
      currentSessionId.current = ""
      setWorking(false)
      return
    }

    if (currentSessionId.current !== sessionId) {
      currentSessionId.current = sessionId
      setResponse("")
      setWorking(true)
      starter((delta, done) => {
        setResponse((s) => `${s}${delta}`)
        if (done) {
          onEnd()
          setWorking(false)
          return
        }
      })
    }
  }, [sessionId, starter, onEnd])

  return `${response}${working ? " [working...]" : " [completed]"}`
}

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
  const [models, setModels] = useState<string[]>([model])

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await llm.models(credential)

      availableModels.sort()
      setModels(availableModels)
    }

    fetchModels()
  }, [credential, llm])

  useEffect(() => {
    const selectedModel = models.includes(model) ? model : ""
    setModel(selectedModel)
    onChange(selectedModel)
  }, [models, model, onChange])

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
  llmId: number
  model: string
}

const loadConfig = (id: string) => {
  return JSON.parse(
    loadConfiguration(`panel${id}`, "") || `{"id":${id},"llmId":0,"model":""}`,
  ) as PanelConfig
}

const saveConfig = (config: PanelConfig) => {
  saveConfiguration(`panel${config.id}`, "", JSON.stringify(config))
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

  const [config, setConfig] = useState(() => loadConfig(id) || { id, llmId: 0, model: "" })
  const [llmId, setLlmId] = useState(() => config.llmId)
  const llm = InstalledLLMs[llmId]
  const credential = llm.apiKey || loadCredential(llm.name)

  const [model, setModel] = useState(config.model)

  useEffect(() => {
    saveConfig(config)
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

  const response = useResponse({
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
            onChange={(e) => setLlmId(+(e.target.value || "0"))}
          >
            {InstalledLLMs.map(
              (llm, i) =>
                i !== 0 && (
                  <MenuItem key={llm.name} value={i}>
                    {llm.name}
                  </MenuItem>
                ),
            )}
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
          <SpeechButton text={response} />
          <Button
            onClick={() => {
              setMarkdown((v) => !v)
            }}
          >
            {markdown ? "Text" : "Markdown/Tex"}
          </Button>
        </Stack>
        <ResponseField text={response} markdown={markdown} />
      </Stack>
    </>
  )
}
