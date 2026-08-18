import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const inputDir = path.resolve('src/assets/images/hero')
const outputDir = path.resolve('src/assets/images/hero/optimized')

await mkdir(outputDir, { recursive: true })

const images = [
  {
    input: path.join(inputDir, 'hero-horizontal.jpg'),
    output: path.join(outputDir, 'hero-horizontal-optimized.jpg'),
    width: 1800,
    quality: 72,
  },
  {
    input: path.join(inputDir, 'hero-vertical.jpg'),
    output: path.join(outputDir, 'hero-vertical-optimized.jpg'),
    width: 900,
    quality: 72,
  },
]

for (const image of images) {
  await sharp(image.input)
    .resize({
      width: image.width,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: image.quality,
      mozjpeg: true,
    })
    .toFile(image.output)

  const metadata = await sharp(image.output).metadata()

  console.log(
    `Done: ${path.basename(image.output)} | ${metadata.width}x${metadata.height}`
  )
}

console.log('Hero images optimized successfully.')