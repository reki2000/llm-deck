
import { useState } from "react";
import { InstalledLLMs } from "./llm/installed";

import { Box, Button, CssBaseline, Grid, Link, Stack, TextField } from "@mui/material";
import { ConfigDialog } from "./ConfigDialog";
import InstructionPanel from "./Instruction/InstructionPanel";
import { LLMPanel } from "./Panel/LLMPanel";

import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { usePanelContext } from "./PanelContext";
import { MinWidthButton } from "./components/miniButton";
import ZipUploader from "./components/zipUploader";


const useConfigDialog = () => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  return  {dialog: configDialogOpen && (
    <ConfigDialog
      open={configDialogOpen}
      llmProviders={InstalledLLMs}
      onClose={() => {
        setConfigDialogOpen(false)
      }}
    />
  ), open: () => setConfigDialogOpen(true)}
}

function App() {
  const {dialog: configDialog, open: openConfigDialog} = useConfigDialog()

  const [prompt, setPrompt] = useState("")
  const [instruction, setInstruction] = useState("")
  const [fileContent, setFileContent] = useState("")

  const {panels, add, startAll, stopAll} = usePanelContext()
  console.log("App:panels", panels)

  const workingCount = Object.values(panels).filter((p)=>p).length

  const handleSend = async () => {
    if (workingCount > 0) {
      stopAll()
    } else {
      startAll()
    }
  }

  return (
    <>
      <CssBaseline />
      <Stack spacing={1} p={2}>
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Box>LLM Deck</Box>
          <Link href="https://github.com/reki2000/llm-deck">GitHub</Link>
          <Button variant="outlined" onClick={() => openConfigDialog()}>
            Config
          </Button>
          {configDialog}
        </Stack>

        <InstructionPanel onChange={setInstruction} />

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
            disabled={workingCount > 0}
          />
          <ZipUploader onLoad={(s:string)=>setFileContent(s)}/>
          <MinWidthButton onClick={handleSend}>
            {workingCount > 0 ? `Stop ${workingCount}` : <SendIcon/>}
          </MinWidthButton>
          <MinWidthButton size="small" onClick={add}>
            <AddIcon/>
          </MinWidthButton>
        </Stack>
        <Grid container >
          {Object.keys(panels).map((id) => (
            <Grid key={id} item xs={12} md={6} xl={4}>
              <LLMPanel
                panelId={id}
                instruction={instruction}
                prompt={`${prompt} ${fileContent}`}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  )
}

export default App
