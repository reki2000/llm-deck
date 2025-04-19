import 'katex/dist/katex.min.css'
import React, { useState } from 'react' // Import useState
import ReactMarkdown, { type Options } from 'react-markdown' // Use 'type' for Options
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Helper function to extract text content from children
const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('')
  }
  if (React.isValidElement(node) && node.props.children) {
    return getNodeText(node.props.children)
  }
  return ''
}

const TexMarkdown = (props: Readonly<Options>) => (
  <ReactMarkdown
    components={{
      pre: ({ node, ...preProps }) => {
        const [buttonText, setButtonText] = useState('Copy')

        // Find the code element within the pre element's children
        const codeElement = React.Children.toArray(preProps.children).find(
          (child) => React.isValidElement(child) && child.type === 'code',
        )

        const handleCopy = () => {
          if (codeElement && React.isValidElement(codeElement)) {
            const codeString = getNodeText(codeElement.props.children)
            navigator.clipboard.writeText(codeString).then(
              () => {
                setButtonText('Copied!')
                setTimeout(() => setButtonText('Copy'), 2000) // Reset after 2 seconds
              },
              (err) => {
                console.error('Failed to copy text: ', err)
                setButtonText('Error')
                setTimeout(() => setButtonText('Copy'), 2000)
              },
            )
          }
        }

        return (
          <div style={{ position: 'relative' }}>
            <button
              type="button" // Add type="button"
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '1em',
                right: '0.5em',
                fontSize: '0.8em',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer',
                zIndex: 1, // Ensure button is clickable
              }}
            >
              {buttonText}
            </button>
            <pre
              style={{
                backgroundColor: '#f0f0f0',
                whiteSpace: 'pre',
                overflowX: 'auto',
                // paddingTop: '2em', // Removed padding
              }}
              {...preProps}
            />
          </div>
        )
      },
      // Keep existing code styling if needed, or remove if pre handles everything
      // code: ({node, inline, className, children, ...props}) => {
      //   const match = /language-(\w+)/.exec(className || '')
      //   return !inline && match ? (
      //     <SyntaxHighlighter style={docco} language={match[1]} PreTag="div" {...props}>
      //       {String(children).replace(/\n$/, '')}
      //     </SyntaxHighlighter>
      //   ) : (
      //     <code className={className} {...props}>
      //       {children}
      //     </code>
      //   )
      // }
    }}
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    {...props}
  />
)

export default TexMarkdown
