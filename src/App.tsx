import {
  Box,
  Button,
  CssBaseline,
  Link,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material"

import { useEffect, useRef, useState } from "react"
import { InstalledLLMs, llmProvider, llmStreahBreaker as llmStreamBreaker } from "./llm/llm"

import { CredentialField } from "./CredentialField"
import Markdown from "./TexMarkdown"
import { loadConfiguration, saveConfiguration } from "./configurations"
import { loadCredential, saveCredential } from "./credential"

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
const LLMPanel = ({
  sessionId,
  prompt,
  llm,
  onEnd,
}: { sessionId: string; prompt: string; llm: llmProvider; onEnd: () => void }) => {
  const [credential, setCredential] = useState(() => llm.apiKey || loadCredential(llm.name))
  const [showCredential, setShowCredential] = useState(false)

  const instructions = [
    "answer in the language used in the prompt.",
    "your answer must be formatted in markdown, with tex part should be quoted with $, $$.",
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
        <Stack direction="row" display="flex" alignItems="center">
          <Box>{llm.name}</Box>
          <Button
            onClick={() => {
              setShowCredential((v) => !v)
            }}
          >
            Credential
          </Button>
          <Switch
            value={markdown}
            onChange={() => {
              setMarkdown((v) => !v)
            }}
          />
        </Stack>
        <CredentialField
          value={credential}
          label={llm.apiKeyLabel}
          sx={{ display: showCredential ? "block" : "none" }}
          onChange={(e) => {
            const s = e.target.value || ""
            setCredential(s)
            saveCredential(llm.name, s)
          }}
        />
        <Stack direction="row">
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

        {markdown ? <Markdown>{response}</Markdown> : response}
      </Stack>
    </>
  )
}

function App() {
  const [prompt, setPrompt] = useState("")
  const [sending, setSending] = useState(0)
  const [sessionId, setSessionId] = useState("")

  const handleSend = async () => {
    if (sending > 0) {
      setSessionId("")
      setSending(0)
    } else {
      setSessionId(`${Math.random()}`)
      setSending(3)
    }
  }

  return (
    <>
      <CssBaseline />
      <Stack spacing={2} p={2}>
        <Stack direction="row" spacing={2}>
          <Box>LLM Deck</Box>
          <Link href="https://github.com/reki2000/llm-deck">GitHub</Link>
          <Box>
            Your API Keys will be stored in your browser's local storage and will NEVER be sent to
            the host. However, avoid using untrusted hosts.
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            fullWidth
            multiline
            autoFocus
            label="prompt; SHIFT+ENTER to Send"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === "Enter") {
                handleSend()
                event.preventDefault()
              }
            }}
            disabled={sending > 0}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleSend()
            }}
          >
            {sending > 0 ? `Stop ${sending}` : "Send"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          {[1, 2, 3].map((i, index) => (
            <LLMPanel
              key={`${InstalledLLMs[i].name}-${index}`}
              llm={InstalledLLMs[i]}
              sessionId={sessionId}
              prompt={prompt}
              onEnd={() => setSending((c) => (c > 0 ? c - 1 : 0))}
            />
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default App
