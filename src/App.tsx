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
import { InstalledLLMs, llmStarter, llmStreahBreaker } from "./llm/llm"

import Markdown from "react-markdown"
import { loadCredential, saveCredential } from "./credential"

type LLM = {
  name: string
  credential: string
  label: string

  response: string
  working: boolean

  start: llmStarter
  stop?: llmStreahBreaker
}

function App() {
  const [prompt, setPrompt] = useState("")
  const [sending, setSending] = useState(0)

  const llmStates = InstalledLLMs.map(({ label, name, start, apiKey }) =>
    useState<LLM>({
      name,
      credential: apiKey || loadCredential(name),
      label,
      start,
      response: "",
      working: false,
    }),
  )

  const handleSend = async () => {
    if (sending > 0) {
      for (const [llm, setLLM] of llmStates) {
        llm.stop?.()
        setLLM((s) => ({
          ...s,
          working: false,
        }))
      }
      setSending(0)
    } else {
      for (const [llm, setLLM] of llmStates) {
        ;(async () => {
          setSending((c) => c + 1)
          setLLM((s) => ({
            ...s,
            response: "",
            working: true,
          }))
          const breaker = await llm.start(llm.credential, prompt, (delta, done) => {
            if (done) {
              setSending((c) => c - 1)
              setLLM((s) => ({ ...s, working: false }))
            } else {
              setLLM((s) => ({ ...s, response: `${s.response}${delta}` }))
            }
          })
          setLLM((s) => ({
            ...s,
            stop: breaker,
          }))
        })()
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false)

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
            disabled={sending > 0}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleSend()
            }}
          >
            {sending > 0 ? "Stop" : "Send"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          {llmStates.map(([llm, setLlm]) => (
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
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={llm.credential}
                onChange={(e) => {
                  const credential = e.target.value
                  setLlm((s) => ({ ...s, credential }))
                  saveCredential(llm.name, credential)
                }}
              />
              <Markdown>{`${llm.response}${
                llm.working ? "[working...]" : "[completed]"
              }`}</Markdown>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default App
