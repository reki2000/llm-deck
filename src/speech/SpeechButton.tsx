import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined"
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined"
import { Button } from "@mui/material"

import { useSpeech } from "./useSpeech"

interface SpeechButtonProps {
  text: string
  working: boolean
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({ text, working }) => {
  const { speaking, toggleSpeaking } = useSpeech(text, working)

  return (
    <Button sx={{minWidth: 'auto'}}  onClick={toggleSpeaking}>
      {speaking ? <PauseCircleOutlinedIcon /> : <PlayCircleOutlinedIcon />}
    </Button>
  )
}
