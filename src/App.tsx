import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
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

type LLM = {
  name: string
  handler: llmHandler

  response: string
  setResponse: React.Dispatch<React.SetStateAction<string>>
  setDelta: (s: string) => void
  breaker?: llmStreahBreaker

  credential: string
  setCredential: React.Dispatch<React.SetStateAction<string>>
}

const LLM_SETTINGS = [
  { name: "gpt4-turbo", handler: gpt4turbo },
  { name: "gemini 1.0 pro", handler: gemini1 },
  { name: "claude 2.1", handler: claude21 },
]

function App() {
  const [prompt, setPrompt] = useState("")

  const llms: LLM[] = LLM_SETTINGS.map(({ name, handler }) => {
    const [response, setResponse] = useState("")
    const [credential, setCredential] = useState(localStorage.getItem(name) || "")

    return {
      name,
      response,
      setResponse,
      setDelta: (d) => setResponse((r) => `${r}${d}`),
      handler,
      credential,
      setCredential,
    }
  })

  const handleSend = async () => {
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

  const handleCredentialChange = (llm: LLM, value: string) => {
    llm.setCredential(value)
    localStorage.setItem(llm.name, value)
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
        <Stack direction="row" alignItems="center">
          <TextField
            fullWidth
            multiline
            label="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            onClick={() => {
              handleSend()
            }}
          >
            Send
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          {llms.map((llm) => (
            <Stack key={llm.name} spacing={1} width="100%">
              <Box>{llm.name}</Box>
              <TextField
                label="credential"
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
