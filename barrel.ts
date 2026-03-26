import { promises as fs } from 'node:fs'
import path from 'node:path'

import chokidar from 'chokidar'

// ===== CLI OPTIONS =====

const ROOT = path.resolve(process.argv[2] || 'src')
const useSimpleQuote = process.argv.includes('--simple-quote')
const noSemi = process.argv.includes('--no-semi')

const quote = useSimpleQuote ? '\'' : '"'
const semi = noSemi ? '' : ';'
// ========================

/** Lê a primeira linha de um arquivo (ou retorna null) */
async function readFirstLine(file: string): Promise<string | null> {
  try {
    const data = await fs.readFile(file, 'utf8')
    const [first] = data.split(/\r?\n/)

    return first?.trim() ?? null
  } catch {
    return null
  }
}

/** Verifica se um arquivo existe */
async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

/** Gera o conteúdo de um barrel para a pasta especificada */
async function generateBarrel(dir: string) {
  const indexPath = path.join(dir, 'index.ts')

  // Só gera se o arquivo começar com 'use barrel' ou "use barrel"
  const firstLine = await readFirstLine(indexPath)

  if(firstLine !== '\'use barrel\'' && firstLine !== '"use barrel"') {
    return
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  const folders: string[] = []

  for(const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if(entry.name.startsWith('.') || entry.name === 'node_modules') continue

    if(entry.isDirectory()) {
      const hasIndex = await fileExists(path.join(fullPath, 'index.ts'))

      if(hasIndex) folders.push(entry.name)
    } else if(
      entry.isFile()
      && entry.name.endsWith('.ts')
      && entry.name !== 'index.ts'
    ) {
      files.push(entry.name.replace(/\.ts$/, ''))
    }
  }

  const exports = [
    ...files.map(f => `export * from ${quote}./${f}${quote}${semi}`),
    ...folders.map(f => `export * from ${quote}./${f}${quote}${semi}`),
  ]

  const header = `${quote}use barrel${quote}`
  const content = [header, '', exports.join('\n'), ''].join('\n')

  const existing = await fs.readFile(indexPath, 'utf8').catch(() => '')

  if(existing !== content) {
    await fs.writeFile(indexPath, content, 'utf8')
    console.log('🧱 Barrel atualizado:', path.relative(ROOT, indexPath))
  }
}

/** Recalcula barrel da pasta atual e recursivamente dos pais */
async function updateHierarchy(filePath: string) {
  let currentDir = path.dirname(filePath)

  while(currentDir.startsWith(ROOT)) {
    const indexPath = path.join(currentDir, 'index.ts')
    const hasIndex = await fileExists(indexPath)

    if(hasIndex) await generateBarrel(currentDir)
    const parent = path.dirname(currentDir)

    if(parent === currentDir) break
    currentDir = parent
  }
}

/** Inicializa o watcher */
async function main() {
  console.log(`👀 Assistindo: ${ROOT}`)
  console.log(
    `⚙️  Opções: ${useSimpleQuote ? 'aspas simples' : 'aspas duplas'}, ${
      noSemi ? 'sem ponto e vírgula' : 'com ponto e vírgula'
    }`,
  )

  const watcher = chokidar.watch(ROOT, {
    persistent: true,
    ignoreInitial: false,
    ignored: /(^|[/\\])\../,
    depth: Infinity,
  })

  const update = async (filePath: string) => {
    if(path.basename(filePath) === 'index.ts') {
      // se o arquivo index.ts mudou, verifica se tem 'use barrel'
      const firstLine = await readFirstLine(filePath)

      if(firstLine === '\'use barrel\'' || firstLine === '"use barrel"') {
        await generateBarrel(path.dirname(filePath))
      }
    } else {
      // se não for index.ts, atualiza hierarquia normalmente
      await updateHierarchy(filePath)
    }
  }

  watcher
    .on('add', update)
    .on('change', update)
    .on('unlink', update)
    .on('addDir', update)
    .on('unlinkDir', update)
}

main().catch(console.error)
