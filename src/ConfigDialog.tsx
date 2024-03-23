import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Select,
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
      sx={{ width: "400px" }}
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
  const [pollyCredential, setPollyCredential] = useState(() => loadCredential("polly"))
  const [voice, setVoice] = useState(() => loadCredential("polly-voice") || "Mizuki")

  return (
    <Dialog {...props}>
      <DialogTitle>LLM Provider Configurations</DialogTitle>
      <DialogContent>
        <Stack spacing={4} p={2}>
          {llmProviders.slice(1).map((llm) => {
            const [credential, setCredential] = useState(
              () => llm.apiKey || loadCredential(llm.name),
            )

            return (
              <Stack key={llm.name} direction="row" spacing={4} display="flex" alignItems="center">
                <Typography width="100px" variant="h6">
                  {llm.name}
                </Typography>
                <CredentialField
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
          <Stack direction="row" spacing={4} display="flex" alignItems="center">
            <Typography width="100px" variant="h6">
              AWS Polly
            </Typography>
            <CredentialField
              label="REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY"
              defaultValue={pollyCredential}
              size="medium"
              onChange={(e) => {
                const s = e.target.value || ""
                setPollyCredential(s)
                saveCredential("polly", s)
              }}
            />
            <Select
              value={voice}
              label="Voice"
              onChange={(e) => {
                const s = e.target.value || "Mizuki"
                setVoice(s)
                saveCredential("polly-voice", s)
              }}
            >
              <MenuItem value="Mizuki">Mizuki</MenuItem>
              <MenuItem value="Kazumi">Kazumi</MenuItem>
              <MenuItem value="Tomoko">Tomoko</MenuItem>
              <MenuItem value="Takumi">Takumi</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, "backdropClick")}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
