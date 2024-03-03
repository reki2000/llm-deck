export const saveConfiguration = (owner: string, name: string, value: string) => {
  localStorage.setItem(buildKey(owner, name), value)
}

export const loadConfiguration = (owner: string, name: string) => {
  const value = localStorage.getItem(buildKey(owner, name)) || ""
  return value
}

const buildKey = (owner: string, name: string) => `llmdeck-config-${owner}-${name}`
