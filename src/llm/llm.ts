export type llmHandler = (
  credential: string,
  prompt: string,
  on: llmStream,
) => Promise<llmStreahBreaker>

export type llmStream = (delta: string, snapshot: string) => void

export type llmStreahBreaker = () => void
