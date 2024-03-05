import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { loadCredential, saveCredential } from "./credential"
import { llmProvider } from "./llm/llm"

import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material"

const CredentialField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((show) => !show)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export const ConfigDialog = ({
  llmProviders,
  onClose,
  ...props
}: DialogProps & { llmProviders: llmProvider[] }) => {
  return (
    <Dialog {...props}>
      <DialogTitle>LLM Provider Configurations</DialogTitle>
      <DialogContent>
        <Stack spacing={4} p={2}>
          {llmProviders.map((llm) => {
            const [credential, setCredential] = useState(
              () => llm.apiKey || loadCredential(llm.name),
            )

            return (
              <Stack key={llm.name} direction="row" spacing={4} display="flex" alignItems="center">
                <Typography width="100px" variant="h6">
                  {llm.name}
                </Typography>
                <CredentialField
                  sx={{ width: "400px" }}
                  key={llm.name}
                  id={llm.name}
                  label={llm.apiKeyLabel}
                  defaultValue={credential}
                  size="medium"
                  onChange={(e) => {
                    const s = e.target.value || ""
                    setCredential(s)
                    saveCredential(llm.name, s)
                  }}
                />
              </Stack>
            )
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, "backdropClick")}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
