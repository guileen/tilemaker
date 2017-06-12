const Canvas = require('canvas')
const fs = require('fs')
const program = require('commander')
const resolvePath = require('path').resolve

program
.version('0.1.0')
.option('-s, --shape <shape>', 'circle, rect')
.option('--fg <fg>', 'forground color, #000000', '#000000')
.option('--bg <bg>', 'backgroudn color, #ffffff')
.option('-w --width <width>', 'unit in pixel', parseInt, 32)
.option('-h --height <height>', 'unit in pixel', parseInt, 32)
.option('-t --text <text>', 'text')
.option('--textstyle <txt color>', 'text style #000000', '#000000')
.option('--font <font>', 'font size, family,  24px serif', '14px serif')
.option('-o --out <out>', 'output file')

program.parse(process.argv)

var out = program.out
var outstream
if (!out) {
  outstream = process.stdout
} else {
  outstream = fs.createWriteStream(resolvePath(process.cwd(), program.out))
}

const width = program.width
const height = program.height
const canvas = new Canvas(width, height)
const ctx = canvas.getContext('2d')

if (program.bg) {
  ctx.fillStyle = program.bg
  ctx.fillRect(0, 0, width, height)
}

ctx.fillStyle = program.fg
if (program.shape === 'circle') {
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2, true)
  ctx.fill()
} else if (program.shape === 'rect') {
  ctx.fillRect(0, 0, width, height)
}

if (program.text) {
  console.error('textstyle', program.text, program.textstyle, program.font)
  ctx.fillStyle = program.textstyle
  ctx.font = program.font
  ctx.textAlign = 'center'
  ctx.fillText(program.text, width / 2, height / 2, width / 2)
}

canvas.pngStream().pipe(outstream)

