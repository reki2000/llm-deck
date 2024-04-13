import { Box, Button, CssBaseline, Grid, Link, MenuItem, Stack, TextField } from "@mui/material"

import { useEffect, useState } from "react"
import { InstalledLLMs } from "./llm/installed"

import { ConfigDialog } from "./ConfigDialog"
import { LLMPanel } from "./LLMPanel"
import { loadConfiguration, saveConfiguration } from "./configurations"

type Instructions = { [id: string]: string }

function App() {
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [sending, setSending] = useState(0)
  const [sessionId, setSessionId] = useState("")

  const handleSend = async () => {
    if (sending > 0) {
      setSessionId("")
      setSending(0)
    } else {
      setSessionId(`${Math.random()}`)
      setSending(panelIds.length)
    }
  }

  const [instructions, setInstructions] = useState<Instructions>(() => {
    return JSON.parse(loadConfiguration("instructions", "") || "{}") as Instructions
  })
  const [selectedInstruction, setSelectedInstruction] = useState("")

  useEffect(() => {
    saveConfiguration("instructions", "", JSON.stringify(instructions))
  }, [instructions])

  const [panelIds, setPanelIds] = useState<string[]>(
    () => JSON.parse(loadConfiguration("panelIds", "") || "[]") as string[],
  )

  useEffect(() => {
    saveConfiguration("panelIds", "", JSON.stringify(panelIds))
  }, [panelIds])

  return (
    <>
      <CssBaseline />
      <Stack spacing={2} p={2}>
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Box>LLM Deck</Box>
          <Link href="https://github.com/reki2000/llm-deck">GitHub</Link>
          <Button variant="outlined" onClick={() => setConfigDialogOpen(true)}>
            Config
          </Button>
          <ConfigDialog
            open={configDialogOpen}
            llmProviders={InstalledLLMs}
            onClose={() => {
              setConfigDialogOpen(false)
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            select
            label="instruction"
            fullWidth
            value={selectedInstruction}
            onChange={(e) => setSelectedInstruction(e.target.value)}
          >
            {Object.entries(instructions).map(([id, text]) => (
              <MenuItem key={id} value={id} selected={id === selectedInstruction}>
                {text}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setSelectedInstruction("")
              setInstructions((s) => {
                delete s[selectedInstruction]
                return { ...s }
              })
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const id = `${new Date().getTime()}`
              setInstructions((s) => {
                if (!Object.values(s).includes(prompt)) {
                  s[id] = prompt
                }
                return { ...s }
              })
              setSelectedInstruction(id)
            }}
          >
            Add
          </Button>
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
          <Button
            variant="contained"
            onClick={() => {
              setPanelIds((s) => [...s, `${new Date().getTime()}`])
            }}
          >
            Add
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {panelIds.map((id) => (
            <Grid key={id} item xs={12} md={6} xl={4}>
              <LLMPanel
                id={id}
                sessionId={sessionId}
                instruction={instructions[selectedInstruction] || ""}
                prompt={prompt}
                onEnd={() => setSending((c) => (c > 0 ? c - 1 : 0))}
                onClose={() => {
                  setPanelIds((s) => s.filter((c) => c !== id))
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  )
}

export default App
