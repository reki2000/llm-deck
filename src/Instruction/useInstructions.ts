// src/hooks/useInstructions.ts
import { useEffect, useState } from "react"
import { loadConfig, saveConfig } from "../configurations"

type Instructions = { [id: string]: string }

export const useInstructions = (onChange: (s: string) => void) => {
  const [instructions, setInstructions] = useState<Instructions>(
    () => JSON.parse(loadConfig("instructions", "") || "{}") as Instructions,
  )
  const [selectedId, setSelectedId] = useState(() => loadConfig("selectedInstruction", "") || "")

  useEffect(() => {
    saveConfig("selectedInstruction", "", selectedId)
    onChange(instructions[selectedId] || "")
  }, [selectedId, instructions[selectedId], onChange])

  useEffect(() => {
    saveConfig("instructions", "", JSON.stringify(instructions))
  }, [instructions])

  const addInstruction = (text: string) => {
    const id = `${new Date().getTime()}`
    setInstructions((s) => ({ ...s, [id]: text }))
    setSelectedId(id)
  }

  const editInstruction = (id: string, text: string) => {
    setInstructions((s) => ({ ...s, [id]: text }))
  }

  const deleteInstruction = (id: string) => {
    setInstructions((s) => {
      const newInstructions = { ...s }
      delete newInstructions[id]
      return newInstructions
    })
    setSelectedId("")
  }

  return {
    instructions,
    selectedId,
    setSelectedId,
    addInstruction,
    editInstruction,
    deleteInstruction,
  }
}
