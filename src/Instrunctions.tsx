import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { loadConfig, saveConfig } from "./configurations"

type Instructions = { [id: string]: string }

export const InstructionPanel = ({ onChange }: { onChange: (s: string) => void }) => {
  const [instructions, setInstructions] = useState<Instructions>(
    () => JSON.parse(loadConfig("instructions", "") || "{}") as Instructions,
  )

  const [selectedId, setSelectedId] = useState(() => loadConfig("selectedInstruction", "") || "")

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const selected = instructions[selectedId] || ""

  useEffect(() => {
    saveConfig("instructions", "", JSON.stringify(instructions))
    saveConfig("selectedInstruction", "", selectedId)
    onChange(selected)
  }, [instructions, selected, selectedId, onChange])

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        select
        label="instruction"
        fullWidth
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {Object.entries(instructions).map(([id, text]) => (
          <MenuItem key={id} value={id} selected={id === selectedId}>
            {text}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          setSelectedId("")
          setInstructions((s) => {
            delete s[selectedId]
            return { ...s }
          })
        }}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        disabled={selectedId === ""}
        onClick={() => setEditDialogOpen(true)}
      >
        Edit
      </Button>
      <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
        Add
      </Button>
      {addDialogOpen && (
        <EditDialog
          open={true}
          onEnd={(text) => {
            setAddDialogOpen(false)
            if (text === "") {
              return
            }
            const id = `${new Date().getTime()}`
            setInstructions((s) => {
              s[id] = text
              return s
            })
            setSelectedId(id)
          }}
        />
      )}
      {editDialogOpen && (
        <EditDialog
          open={true}
          id={selectedId}
          defaultText={selected}
          onEnd={(text) => {
            setEditDialogOpen(false)
            if (text === "") {
              return
            }
            setInstructions((s) => {
              s[selectedId] = text
              return s
            })
          }}
        />
      )}
    </Stack>
  )
}

const EditDialog = ({
  onEnd,
  id,
  defaultText,
  ...props
}: DialogProps & { id?: string; defaultText?: string; onEnd: (s: string) => void }) => {
  const [text, setText] = useState(defaultText || "")
  return (
    <Dialog {...props} onClose={() => onEnd("")}>
      <DialogTitle>Instruction</DialogTitle>
      <DialogContent>
        {id && <Typography>ID:{id}</Typography>}
        <TextField
          sx={{ minWidth: "400px" }}
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onEnd("")}>Cancel</Button>
        <Button onClick={() => onEnd(text)} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
