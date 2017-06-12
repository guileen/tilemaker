const svg2png = require('svg2png')

function makeTextSVG (text, w, h, x, y, svgStyle) {
  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">

  <text x="${x}" y="${y}" style="${svgStyle}">
  ${text}
  </text>
</svg>
`
}

function txt2png (text, w=300, h=100, x=0, y=50, svgStyle="font-family: Times New Roman; font-size: 44px; stroke: #00ff00; fill: #0000ff;") {
  const svg = makeTextSVG(Buffer.from(text), w, h, x, y, svgStyle)
  console.log(svg)
  return svg2png.sync(svg, {width: w, height: h})
}

module.exports = txt2png

txt2png('1234', 300, 100)
