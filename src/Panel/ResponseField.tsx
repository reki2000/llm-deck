// src/Panel/ResponseField.tsx
import { Fragment } from "react"
import TexMarkdown from "./TexMarkdown"

const ResponseField = ({ text, markdown }: { text: string; markdown: boolean }) => {
  return markdown ? (
    <TexMarkdown>{text}</TexMarkdown>
  ) : (
    text.split("\\n").map((item, i, arr) => (
      <Fragment key={item}>
        {item}
        {i < arr.length - 1 && <br />}
      </Fragment>
    ))
  )
}

export default ResponseField
