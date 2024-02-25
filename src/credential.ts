export const saveCredential = (name: string, value: string) => {
  localStorage.setItem(name, value)
  // document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; samesite=strict;`
}

export const loadCredential = (name: string) => {
  const value = localStorage.getItem(name) || ""
  // const cookies = document.cookie.split("; ")
  // const value = cookies.find((row) => row.startsWith(`${name}=`))?.split("=")[1] || ""
  saveCredential(name, value) // refresh expiration
  return value
}
