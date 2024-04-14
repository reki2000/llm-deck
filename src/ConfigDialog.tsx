import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import { ReactNode, useState } from "react"
import { loadCredential, saveCredential } from "./credential"
import { llmProvider } from "./llm/llm"

import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material"
import { voicesEn, voicesJp } from "./speech/pollyVoices"

const CredentialField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      sx={{ width: "400px" }}
      size="medium"
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

const ConfigItem = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack direction="row" spacing={4} display="flex" alignItems="center">
    <Typography width="100px" variant="h6">
      {label}
    </Typography>
    {children}
  </Stack>
)

export const ConfigDialog = ({
  llmProviders,
  onClose,
  ...props
}: DialogProps & { llmProviders: llmProvider[] }) => {
  const [pollyCredential, setPollyCredential] = useState(() => loadCredential("polly"))
  const [voiceJp, setVoiceJp] = useState(() => loadCredential("polly-voice-jp") || "Mizuki")
  const [voiceEn, setVoiceEn] = useState(() => loadCredential("polly-voice-en") || "Joey")

  return (
    <Dialog {...props}>
      <DialogTitle>Configurations</DialogTitle>
      <DialogContent>
        <Stack spacing={4} p={2}>
          <Box>
            Your API Keys will be stored in your browser's local storage and will NEVER be sent to
            the host. However, avoid using untrusted hosts.
          </Box>

          {llmProviders.slice(1).map((llm) => {
            const [credential, setCredential] = useState(
              () => llm.apiKey || loadCredential(llm.name),
            )

            return (
              <ConfigItem key={llm.name} label={llm.name}>
                <CredentialField
                  label={llm.apiKeyLabel}
                  defaultValue={credential}
                  onChange={(e) => {
                    const s = e.target.value || ""
                    setCredential(s)
                    saveCredential(llm.name, s)
                  }}
                />
              </ConfigItem>
            )
          })}
          <ConfigItem label=" AWS Polly">
            <CredentialField
              label="REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY"
              defaultValue={pollyCredential}
              onChange={(e) => {
                const s = e.target.value || ""
                setPollyCredential(s)
                saveCredential("polly", s)
              }}
            />
          </ConfigItem>
          <ConfigItem label="VoiceID:JP">
            <TextField
              select
              value={voiceJp}
              label="VoiceID"
              onChange={(e) => {
                const s = e.target.value
                setVoiceJp(s)
                saveCredential("polly-voice-jp", s)
              }}
            >
              {voicesJp.map((voice) => (
                <MenuItem key={voice.name} value={voice.name}>
                  {`${voice.name}(${voice.gender}) ${voice.neural ? "TTS" : ""} ${
                    voice.longform ? "Long" : ""
                  } ${voice.bilingual ? "Bi" : ""}`}
                </MenuItem>
              ))}
            </TextField>
          </ConfigItem>
          <ConfigItem label="VoiceID:EN">
            <TextField
              select
              value={voiceEn}
              label="VoiceID"
              onChange={(e) => {
                const s = e.target.value
                setVoiceEn(s)
                saveCredential("polly-voice-en", s)
              }}
            >
              {voicesEn.map((voice) => (
                <MenuItem key={voice.name} value={voice.name}>
                  {`${voice.name}(${voice.gender}) ${voice.neural ? "TTS" : ""} ${
                    voice.longform ? "Long" : ""
                  } ${voice.bilingual ? "Bi" : ""}`}
                </MenuItem>
              ))}
            </TextField>
          </ConfigItem>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, "backdropClick")}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}
