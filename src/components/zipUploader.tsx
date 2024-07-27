import JSZip from 'jszip'
import React from 'react'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import { MinWidthButton } from './miniButton'

const ZipUploader = ({ onLoad }: { onLoad: (s: string) => void }) => {
  const ignoreFiles = ['.*/package-lock.json$', '.*.jar$']

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [size, setSize] = React.useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.error('No file selected')
      return
    }

    const file = event.target.files[0]
    if (!file) {
      console.error('No file selected')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      if (!e.target?.result) return

      const zip = new JSZip()
      try {
        let result = ''
        const zipContent = await zip.loadAsync(e.target.result as ArrayBuffer)
        for (const fileName of Object.keys(zipContent.files)) {
          if (ignoreFiles.some((p) => new RegExp(p).test(fileName))) {
            console.log(`ignoring file: ${fileName}`)
            continue
          }
          const fileData = await zipContent.files[fileName].async('blob')
          const fileText = new TextDecoder().decode(new Uint8Array(await fileData.arrayBuffer())) //TODO: check if decode is successful
          result += `====\nfileName: ${fileName}\n${fileText}\n`
          console.log(`processing file: ${fileName} length: ${fileText.length}`)
        }
        onLoad(`answer the given question with read whole of following files carefully:\n${result}`)
        setSize(result.length)
        console.log('Files successfully decompressed and downloaded')
      } catch (err) {
        console.error('Decompression failed', err)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <MinWidthButton color="primary" onClick={() => fileInputRef.current?.click()}>
        <UploadFileIcon /> {size > 0 && <span>{Math.floor(size / 1000)}k</span>}
      </MinWidthButton>
    </div>
  )
}

export default ZipUploader
