import { useState } from "react"

export const saveConfig = (group: string, name: string, value: string) => {
  console.log("saveConfiguration", group, name, value)
  localStorage.setItem(buildKey(group, name), value)
}

export const loadConfig = (group: string, name: string) => {
  console.log("loadConfiguration", group, name)
  const value = localStorage.getItem(buildKey(group, name)) || ""
  return value
}

const buildKey = (group: string, name: string) => `llmdeck-${group}-${name}`

// wrapper for useState with local storage
export const useConfigState = (group: string, key: string, defaultValue: string) => {
  const [value, setValue] = useState(loadConfig(group, key) || defaultValue)
  return [
    value,
    (s: string) => {
      setValue(s)
      saveConfig("config", key, s)
    },
  ] as [string, (s: string) => void]
}
