import { Button, MenuItem, Stack, TextField } from "@mui/material"

import { Fragment, useEffect, useRef, useState } from "react"
import { llmProvider, llmStreahBreaker as llmStreamBreaker } from "./llm/llm"

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
  onChange,
}: { llm: llmProvider; credential: string; onChange: (_: string) => void }) => {
  const [model, setModel] = useState(() => loadConfiguration(llm.name, "model"))
  const [models, setModels] = useState<string[]>([model])

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await llm.models(credential)

      availableModels.sort()
      setModels(availableModels)

      const selectedModel = availableModels.includes(model) ? model : ""
      setModel(selectedModel)
      onChange(selectedModel)
    }

    fetchModels()
  }, [credential, llm, model, onChange])

  return (
    <TextField
      select
      label={llm.name}
      value={model}
      onChange={(e) => {
        const value = e.target.value || ""
        saveConfiguration(llm.name, "model", value)
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

// LLMPanel is a component that displays the UI of the configurations for a single LLM provider.
// 'sessionID' prop fires the LLM provider to generate the response for the givin prompt and configurations.
export const LLMPanel = ({
  sessionId,
  instruction,
  prompt,
  llm,
  onEnd,
}: {
  sessionId: string
  instruction: string
  prompt: string
  llm: llmProvider
  onEnd: () => void
}) => {
  const credential = llm.apiKey || loadCredential(llm.name)

  const [markdown, setMarkdown] = useState(true)

  const [model, setModel] = useState("")

  const breaker = useRef<llmStreamBreaker | null>(null)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const response = useResponse({
    sessionId,
    starter: (onDelta) => {
      const starter = async () => {
        breaker.current = await llm.start(credential, instruction, prompt, onDelta, { model })
      }
      starter()
    },
    onEnd,
  })

  return (
    <>
      <Stack spacing={1} width="100%">
        <ModelSelect llm={llm} credential={credential} onChange={(v) => setModel(v)} />
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
