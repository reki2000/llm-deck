import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material"
// src/components/EditDialog.tsx
import { useState } from "react"

interface EditDialogProps extends DialogProps {
  id?: string
  defaultText?: string
  onEnd: (s: string) => void
}

const EditDialog: React.FC<EditDialogProps> = ({ onEnd, id, defaultText, ...props }) => {
  const [text, setText] = useState(defaultText || "")

  return (
    <Dialog {...props} onClose={() => onEnd("")}>
      <DialogTitle>Instruction</DialogTitle>
      <DialogContent>
        {id && <Typography>ID: {id}</Typography>}
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

export default EditDialog
