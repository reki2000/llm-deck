import JSZip from 'jszip'
import React from 'react'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import { MinWidthButton } from './miniButton'

const excludeFilePatterns = [
  /\.zip$/, // zip ファイル自身を除外
  /\.rar$/, // rar ファイルを除外
  /\.7z$/, // 7z ファイルを除外
  /\.tar$/, // tar ファイルを除外
  /\.gz$/, // gz ファイルを除外
  /\.exe$/, // 実行可能ファイルを除外
  /\.dll$/, // ダイナミックリンクライブラリを除外
  /\.so$/, // 共有オブジェクトファイルを除外
  /\.class$/, // Java クラスファイルを除外
  /\.pyc$/, // Python コンパイル済みバイトコードを除外
  /Thumbs\.db$/, // Windows のサムネイルキャッシュファイルを除外
  /\.DS_Store$/, // macOS のデスクトップサービスストアファイルを除外
  /package-lock.json$/,
  /\.jar$/,
  /__MACOSX__/, // macOS のメタデータディレクトリを除外
  /node_modules/, // Node.js のモジュールディレクトリを除外
  /vendor/, // サードパーティライブラリのディレクトリを除外
  /\.git/, // Git の管理ディレクトリを除外
  /\.idea/, // JetBrains IDEの設定フォルダ
  /\.vscode/, // Visual Studio Codeの設定フォルダ
  /bower_components/, // Bowerの依存パッケージフォルダ
  /\.tmp/, // 一時ファイルフォルダ
  /\.cache/, // キャッシュファイルフォルダ
  /\.log/, // ログファイル
  /\.lock/, // ロックファイル
  /\.env/, // 環境変数ファイル
  /\.vagrant/, // Vagrantの設定フォルダ
  /\.venv/, // Python仮想環境フォルダ
  /\.pynb_checkpoints/, // Jupyterの一時フォルダ
  /\.pyc/, // Python bytecodeファイル
  /\.png/, //
  /\.jpg/, //
  /\.jpeg/, //
  /\.ico/, //
]

const ZipUploader = ({ onLoad }: { onLoad: (s: string) => void }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [size, setSize] = React.useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.error('No zip file selected')
      return
    }

    const file = event.target.files[0]
    if (!file) {
      console.error('No zip file selected')
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
          if (excludeFilePatterns.some((p) => fileName.match(p))) {
            console.log(`ignoring file: ${fileName}`)
            continue
          }
          const fileData = await zipContent.files[fileName].async('blob')
          const fileText = new TextDecoder().decode(new Uint8Array(await fileData.arrayBuffer())) //TODO: check if decode is successful
          if (fileText.length === 0) {
            console.log(`ignoring empty file: ${fileName}`)
            continue
          }

          result += `====\nfileName: ${fileName}\n${fileText}\n`
          console.log(`processing file: ${fileName} length: ${fileText.length}`)
        }
        onLoad(`answer the given question with read whole of following files carefully:\n${result}`)
        setSize(result.length)
        event.target.value = '' // clear target
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
        accept={'.zip'}
        onChange={handleFileChange}
      />
      <MinWidthButton color="primary" onClick={() => fileInputRef.current?.click()}>
        <UploadFileIcon /> {size > 0 && <span>{Math.floor(size / 1000)}k</span>}
      </MinWidthButton>
    </div>
  )
}

export default ZipUploader
