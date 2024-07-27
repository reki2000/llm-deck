import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { PanelProvider } from "./PanelContext.tsx"

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PanelProvider>
      <App />
    </PanelProvider>
  </React.StrictMode>,
)
