// src/hooks/useModels.ts
import { useEffect, useState } from "react"
import { llmProvider } from "../../llm/llm"

export const useModels = (llm: llmProvider, credential: string) => {
  const [models, setModels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true)
      const availableModels = await llm.models(credential)
      availableModels.sort()
      setModels(availableModels)
      setLoading(false)
    }

    fetchModels()
  }, [credential, llm])

  return { models, loading }
}
