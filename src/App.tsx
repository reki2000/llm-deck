import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material"

import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

import { useState } from "react"
import { claude21 } from "./llm/bedrock"
import { llmHandler, llmStreahBreaker } from "./llm/llm"
import { gpt4turbo } from "./llm/openai"
import { gemini1 } from "./llm/vertexai"

import Markdown from "react-markdown"
import { getCookie, setCookie } from "./cookie"

type LLM = {
  name: string
  handler: llmHandler

  response: string
  setResponse: React.Dispatch<React.SetStateAction<string>>
  setDelta: (s: string) => void
  breaker?: llmStreahBreaker

  credential: string
  setCredential: React.Dispatch<React.SetStateAction<string>>
  label: string
}

const LLM_SETTINGS = [
  { name: "gpt4-turbo", handler: gpt4turbo, label: "OPENAI_API_KEY" },
  { name: "gemini 1.0 pro", handler: gemini1, label: "ACCESS_KEY" },
  {
    name: "claude 2.1",
    handler: claude21,
    label: "AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY",
  },
]

function App() {
  const [prompt, setPrompt] = useState("")
  const [sending, setSending] = useState(false)

  const llms: LLM[] = LLM_SETTINGS.map(({ label, name, handler }) => {
    const [response, setResponse] = useState("")
    const [credential, setCredential] = useState(getCookie(name))

    return {
      name,
      response,
      setResponse,
      setDelta: (d) => setResponse((r) => `${r}${d}`),
      handler,
      credential,
      setCredential,
      label,
    }
  })

  const handleSend = async () => {
    if (sending) {
      for (const llm of llms) {
        ;(async () => {
          llm.breaker?.()
        })()
      }
      setSending(false)
    } else {
      setSending(true)
      for (const llm of llms) {
        ;(async () => {
          llm.setResponse("")
          llm.breaker?.()
          llm.breaker = await llm.handler(llm.credential, prompt, (delta) => {
            llm.setDelta(delta)
          })
        })()
      }
    }
  }

  const handleCredentialChange = (llm: LLM, value: string) => {
    llm.setCredential(value)
    setCookie(llm.name, value)
  }

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <>
      <CssBaseline />
      <Stack spacing={2} p={2}>
        <Stack direction="row" spacing={2}>
          <Box>LLM Deck</Box>
          <Link href="https://github.com/reki2000/llm-deck">GitHub</Link>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            fullWidth
            multiline
            label="prompt; SHIFT+ENTER to Send"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === "Enter") {
                handleSend()
                event.preventDefault()
              }
            }}
            disabled={sending}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleSend()
            }}
          >
            {sending ? "Stop" : "Send"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          {llms.map((llm) => (
            <Stack key={llm.name} spacing={1} width="100%">
              <Box>{llm.name}</Box>
              <TextField
                label={llm.label}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={llm.credential}
                onChange={(e) => {
                  handleCredentialChange(llm, e.target.value)
                }}
              />
              <Markdown>{llm.response}</Markdown>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default App
