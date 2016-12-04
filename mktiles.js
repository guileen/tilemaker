// 使用一个 config.json 或 config.js 来生成一个测试tileset
// 使用 tile 中心点为元坐标
// 参考 tiles-config.js
//
// {
//   width: 32,
//   height: 32,
//   tiles: [
//     {
//       id: 1,
//       rotate: 90,
//       sprites: [
//         {type: 'rect', style: '#ff00ff'},
//         {type: 'circle', style: '#ff0000', margin: 2},
//         {type: 'arc', style: '#ff0000', margin: 2},
//         {type: 'text'}
//       ]
//     }
//   ]
// }
//
//

const Canvas = require('canvas')
const Image = Canvas.Image
const fs = require('fs')
const program = require('commander')
const resolvePath = require('path').resolve

program
.version('0.1.0')
.usage('[options] <file>')
.option('-o --out <out>', 'output file')
.parse(process.argv)

if (!program.args.length) {
  program.outputHelp()
  process.exit(0)
}

var out = program.out
var outstream
if (!out) {
  outstream = process.stdout
} else {
  outstream = fs.createWriteStream(resolvePath(process.cwd(), program.out))
}

const config = getConfig()

const width = config.width
const height = config.height
const maxId = getMaxID(config.tiles)
var cols = config.cols || Math.ceil(Math.sqrt(maxId))
var rows = Math.ceil(maxId / cols)
const canvas = new Canvas(cols * width, rows * height)
const ctx = canvas.getContext('2d')
config.tiles.forEach(tile => drawTile(ctx, width, height, cols, tile))
canvas.pngStream().pipe(outstream)

function getConfig () {
  const configFile = program.args[0]
  const fullpath = resolvePath(process.cwd(), configFile)
  return require(fullpath)
}

function getMaxID (tiles) {
  return Math.max.apply(null, tiles.map(tile => tile.id))
}

function drawTile (ctx, w, h, cols, tile) {
  var index = tile.id - 1
  ctx.save()
  ctx.translate((index % cols) * w, Math.floor(index / cols) * h)

  drawSprite(ctx, w, h, tile)
  tile.sprites && tile.sprites.forEach(sprite => drawSprite(ctx, w, h, sprite))

  ctx.restore()
}

function getMargin (w, h, margin) {
  var m = margin || 0
  if (margin < 1) {
    m = margin * w / 2
  }
  return Math.round(m)
}

function drawSprite (ctx, w, h, sprite) {
  if (!sprite) {
    return
  }
  console.error('drawSprite', w, h, sprite)
  var margin = getMargin(w, h, sprite.margin)
  if (sprite.bg) {
    ctx.fillStyle = sprite.bg
    ctx.fillRect(margin, margin, w - 2 * margin, h - 2 * margin)
  }
  ctx.save()
  switch (sprite.type) {
    case 'rect':
      drawRect(ctx, w, h, sprite)
      break
    case 'circle':
      drawCircle(ctx, w, h, sprite)
      break
    case 'arc':
      drawArc(ctx, w, h, sprite)
      break
    case 'text':
      drawText(ctx, w, h, sprite)
      break
    case 'image':
      drawImage(ctx, w, h, sprite)
      break
  }
  ctx.restore()
}

function drawRect (ctx, w, h, sprite) {
  const margin = getMargin(w, h, sprite.margin)
  console.error('drawRect', margin, sprite.style)
  ctx.fillStyle = sprite.style
  ctx.fillRect(margin, margin, w - 2 * margin, h - 2 * margin)
}

function drawArc (ctx, w, h, sprite) {
  const margin = getMargin(w, h, sprite.margin)
  ctx.fillStyle = sprite.style
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - margin, sprite.begin * Math.PI / 180, sprite.end * Math.PI / 180, true)
  ctx.fill()
}

function drawCircle (ctx, w, h, sprite) {
  const margin = getMargin(w, h, sprite.margin)
  ctx.fillStyle = sprite.style
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - margin, 0, Math.PI * 2, true)
  ctx.fill()
}

function drawText (ctx, w, h, sprite) {
  const margin = getMargin(w, h, sprite.margin)
  ctx.fillStyle = sprite.style
  ctx.font = sprite.font || '10px Helvetica'
  // ctx.textAlign = 'center'
  ctx.textBaseLine = 'hanging'
  ctx.fillText(sprite.text, margin, margin)
}

function drawImage (ctx, w, h, sprite) {
  const margin = getMargin(w, h, sprite.margin)
  var img = new Image()
  var fullpath = resolvePath(process.cwd(), sprite.image)
  var buff = fs.readFileSync(fullpath)
  img.src = buff
  ctx.drawImage(img, margin, margin, w - 2 * margin, h - 2 * margin)
}

