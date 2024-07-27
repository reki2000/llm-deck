import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { loadConfig, saveConfig } from "./configurations"

type PanelContextType = {
  panels: {[k: string]: boolean}
  add: () => void
  close: (id: string) => void
  startAll: () => void
  stopAll: () => void
  notifyState: (id: string, working: boolean) => void
}

const PanelContext = createContext<PanelContextType>({panels: {}, add: ()=>{}, close:()=>{}, startAll:()=>{}, stopAll:()=>{}, notifyState:()=>{} })

export const usePanelContext = () => useContext(PanelContext)

export const PanelProvider = ({ children } : {children: ReactNode}) => {
  const loadPanelIds = () => {
    const ids = JSON.parse(loadConfig("panelIds", "") || "[]") as string[]
    return Object.fromEntries(ids.map((id) => [id, false])) 
  }

  const [panels, setPanels] = useState(() => loadPanelIds())

  useEffect(() => saveConfig("panelIds", "", JSON.stringify(Object.keys(panels))), [panels])

  const add = () => setPanels({ ...panels, [`${new Date().getTime()}`]: false })
  const close = (id: string) => setPanels(({[id]:_, ...s}) => s) 

  const setWorking = (working: boolean) => 
    setPanels(Object.fromEntries(Object.keys(panels).map((id) => [id, working])))
  
  const startAll = () => setWorking(true)
  const stopAll = () => setWorking(false)

  const notifyState = (id: string, working: boolean) => {
    setPanels(prev => ({ ...prev, [id]: working }))
  }

  console.log("context: ", panels)

  return (<PanelContext.Provider value={{ panels, add, close, startAll, stopAll, notifyState }}>
    {children}
  </PanelContext.Provider>)
}
