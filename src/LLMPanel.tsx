import { MenuItem, Select, Stack, Switch } from "@mui/material"

import { useEffect, useRef, useState } from "react"
import { llmProvider, llmStreahBreaker as llmStreamBreaker } from "./llm/llm"

import Markdown from "./TexMarkdown"
import { loadConfiguration, saveConfiguration } from "./configurations"
import { loadCredential } from "./credential"

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

// LLMPanel is a component that displays the UI of the configurations for a single LLM provider.
// 'sessionID' prop is used to start the LLM provider with the givin prompt and configurations.
export const LLMPanel = ({
  sessionId,
  prompt,
  llm,
  onEnd,
}: { sessionId: string; prompt: string; llm: llmProvider; onEnd: () => void }) => {
  const credential = llm.apiKey || loadCredential(llm.name)

  const instructions = [
    "Format your answer in Markdown.",
    "Only when your answer includes formula, quote them with $ or $$.",
  ]

  const [markdown, setMarkdown] = useState(true)

  const [model, setModel] = useState(() => loadConfiguration(llm.name, "model"))
  const [models, setModels] = useState<string[]>([model])

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await llm.models(credential)
      availableModels.sort()
      setModels(availableModels)
      setModel(availableModels.includes(model) ? model : "")
    }

    fetchModels()
  }, [credential, llm, model])

  const breaker = useRef<llmStreamBreaker | null>(null)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const response = useResponse({
    sessionId,
    starter: (onDelta) => {
      ;(async () => {
        breaker.current = await llm.start(credential, instructions, prompt, onDelta, { model })
      })()
    },
    onEnd,
  })

  return (
    <>
      <Stack spacing={1} width="100%">
        <Stack spacing={2} direction="row" display="flex" alignItems="center">
          <Select
            value={model}
            onChange={(e) => {
              const value = e.target.value || ""
              saveConfiguration(llm.name, "model", value)
              setModel(value)
            }}
          >
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
          {/* <Button onClick={fetchModels}>Reload</Button> */}
        </Stack>
        <Stack direction="row" display="flex" alignItems="center">
          text
          <Switch
            defaultChecked
            onChange={() => {
              setMarkdown((v) => !v)
            }}
          />
          markdown/tex
        </Stack>
        {markdown ? <Markdown>{response}</Markdown> : response}
      </Stack>
    </>
  )
}
