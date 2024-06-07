import { Visibility, VisibilityOff } from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material"
import { ReactNode, useState } from "react"

import { useConfigState } from "./configurations"
import { llmProvider } from "./llm/llm"
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
  const [pollyCredential, setPollyCredential] = useConfigState("config", "polly", "")
  const [voiceJp, setVoiceJp] = useConfigState("config", "polly-voice-jp", "Mizuki")
  const [voiceEn, setVoiceEn] = useConfigState("config", "polly-voice-en", "Joey")

  const llmWithCredentials = llmProviders.map((llm) => {
    const [credential, setCredential] = useConfigState("config", llm.id, llm.localApiKey)
    return {
      llm,
      credential,
      setCredential,
    }
  })

  return (
    <Dialog {...props}>
      <DialogTitle>Configurations</DialogTitle>
      <DialogContent>
        <Stack spacing={4} p={2}>
          <Box>
            Your API Keys will be stored in your browser's local storage and will NEVER be sent to
            the host. However, avoid using untrusted hosts.
          </Box>

          {llmWithCredentials.map(({ llm, credential, setCredential }) => (
            <ConfigItem key={llm.name} label={llm.name}>
              <CredentialField
                label={llm.apiKeyLabel}
                defaultValue={credential}
                onChange={(e) => {
                  const s = e.target.value || ""
                  setCredential(s)
                }}
              />
            </ConfigItem>
          ))}
          <ConfigItem label=" AWS Polly">
            <CredentialField
              label="REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY"
              defaultValue={pollyCredential}
              onChange={(e) => {
                setPollyCredential(e.target.value)
              }}
            />
          </ConfigItem>
          {[
            { label: "VoiceID:JP", value: voiceJp, list: voicesJp, setter: setVoiceJp },
            { label: "VoiceID:EN", value: voiceEn, list: voicesEn, setter: setVoiceEn },
          ].map(({ label, value, list, setter }) => (
            <ConfigItem label={label}>
              <TextField
                select
                value={value}
                label={label}
                onChange={(e) => {
                  setter(e.target.value)
                }}
              >
                {list.map((voice) => (
                  <MenuItem key={voice.name} value={voice.name}>
                    {`${voice.name}(${voice.gender}) ${voice.neural ? "TTS" : ""} ${
                      voice.longform ? "Long" : ""
                    } ${voice.bilingual ? "Bi" : ""}`}
                  </MenuItem>
                ))}
              </TextField>
            </ConfigItem>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, "backdropClick")}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}
