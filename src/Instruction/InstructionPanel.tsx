// src/Instrunctions.tsx
import { Button, MenuItem, Stack, TextField } from "@mui/material"
import { useState } from "react"
import EditDialog from "./EditDialog"
import { useInstructions } from "./useInstructions"

interface InstructionPanelProps {
  onChange: (s: string) => void
}

const InstructionPanel: React.FC<InstructionPanelProps> = ({ onChange }) => {
  const {
    instructions,
    selectedId,
    setSelectedId,
    addInstruction,
    editInstruction,
    deleteInstruction,
  } = useInstructions(onChange)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        select
        label="Instruction"
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
          deleteInstruction(selectedId)
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
            if (text !== "") {
              addInstruction(text)
            }
          }}
        />
      )}
      {editDialogOpen && (
        <EditDialog
          open={true}
          id={selectedId}
          defaultText={instructions[selectedId]}
          onEnd={(text) => {
            setEditDialogOpen(false)
            if (text !== "") {
              editInstruction(selectedId, text)
            }
          }}
        />
      )}
    </Stack>
  )
}

export default InstructionPanel
