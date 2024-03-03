export const saveCredential = (name: string, value: string) => {
  localStorage.setItem(name, value)
}

export const loadCredential = (name: string) => {
  const value = localStorage.getItem(name) || ""
  return value
}
