export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; samesite=strict;`
}

export const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ")
  const value = cookies.find((row) => row.startsWith(`${name}=`))?.split("=")[1] || ""
  setCookie(name, value) // refresh expiration
  return value
}
