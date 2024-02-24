import { Box, Button, CssBaseline, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { llmHandler, llmStreahBreaker } from "./llm/llm"
import gpt4turbo from "./llm/openai"
import gemini1 from "./llm/vertexai"

type LLM = {
  name: string
  response: string
  setResponse: React.Dispatch<React.SetStateAction<string>>
  setDelta: (s: string) => void
  handler: llmHandler
  breaker?: llmStreahBreaker
}

const LLM_SETTINGS = [
  { name: "gpt4", handler: gpt4turbo },
  { name: "gemini1", handler: gemini1 },
]

function App() {
  const credentials = JSON.parse(import.meta.env.VITE_GEMINI_API_JSON)
  console.debug(credentials)
  console.log(credentials)
  console.log("test")

  const [prompt, setPrompt] = useState("")

  const llms: LLM[] = LLM_SETTINGS.map(({ name, handler }) => {
    const [response, setResponse] = useState("")

    const setDelta = (delta: string) => {
      setResponse((response) => `${response}${delta}`)
    }

    return { name, response, setResponse, setDelta, handler }
  })

  const handleSend = async () => {
    for (const llm of llms) {
      llm.breaker?.()
      llm.breaker = await llm.handler(prompt, (delta) => {
        llm.setDelta(delta)
      })
    }
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
            id="prompt"
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
              {llm.response.split("\n").map((line, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Typography key={index}>{line}</Typography>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default App
