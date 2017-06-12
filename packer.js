const Canvas = require('canvas')
const Image = Canvas.Image
const fs = require('fs')
const program = require('commander')
const resolvePath = require('path').resolve

program
.version('0.1.0')
.option('-d, --dir <folder>', 'folder', './')
.option('-w, --width <width>', 'tile width', parseInt, 32)
.option('-h, --height <height>', 'tile height', parseInt, 32)
.option('-o --out <out>', 'output file')

program.parse(process.argv)

// get MaxFileIndex
const dir = resolvePath(process.cwd(), program.dir)

var files = fs.readdirSync(dir)
console.error('files', files)
files = files.filter(name => name.match(/\d+\.png$/))
console.error('files', files)
var indexes = files.map(getFileIndex)
console.error('indexes', indexes)
var maxFileIndex = Math.max.apply(null, files.map(getFileIndex))
console.error('maxFileIndex', maxFileIndex)
var tw = Math.ceil(Math.sqrt(maxFileIndex))
var th = Math.ceil(maxFileIndex / tw)

function getFileIndex (filename) {
  return parseInt(filename.substring(0, filename.length - 4), 10)
}

var out = program.out
var outstream
if (!out) {
  outstream = process.stdout
} else {
  outstream = fs.createWriteStream(resolvePath(process.cwd(), program.out))
}

const width = program.width
const height = program.height

const canvas = new Canvas(tw * width, th * height)
const ctx = canvas.getContext('2d')

for (let file of files) {
  var index = getFileIndex(file) - 1
  var fullpath = resolvePath(dir, file)
  var buffer = fs.readFileSync(fullpath)
  var img = new Image()
  img.src = buffer
  ctx.drawImage(img, (index % tw) * width, Math.floor(index / tw) * height, img.width, img.height)
}

canvas.pngStream().pipe(outstream)

