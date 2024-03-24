import "katex/dist/katex.min.css"
import ReactMarkdown, { Options } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

const TexMarkdown = (props: Readonly<Options>) => (
  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} {...props} />
)

export default TexMarkdown
