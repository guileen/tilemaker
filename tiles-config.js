module.exports = {
  width: 32,
  height: 32,
  // Tiles of each row, default Math.ceil(Math.sqrt(maxId))
  cols: 5,
  tiles: [
    {
      // Use id instead of index in tiles,
      // when you add or remove tile in tiles,
      // ID will not change.
      id: 1,
      sprites: [
        {type: 'rect', style: '#000000'},
        {type: 'arc', style: '#ff0000', begin: 45, end: 135},
        {
          type: 'circle',
          style: '#0000ff',
          // margin < 0, unit in relative.
          // 0.01 is 1%, Math.round(0.01 * width / 2)
          // margin > 0, is pixel
          margin: 0.3
        },
        //{type: 'text', text: '1'}
      ]
    },
    {
      // tile itself could use as sprite
      id: 2,
      type: 'circle',
      style: '#00ff00',
      margin: 2,
    },
    {
      id: 3,
      // bg is shortcut for {type: rect, style: 'style'}
      bg: 'red',
    },
    {
      id: 4,
      type: 'image',
      // use image directly
      image: './avatar.jpg',
    },
    {
      id: 5,
      bg: '#ff0000'
    },
    {
      id: 6,
      type: 'circle',
      style: 'black'
    },
    {
      id: 7,
      bg: '#ff0000'
    },
    {
      id: 8,
      type: 'circle',
      style: 'black'
    },
    {
      // ID 不需要保持连续
      id: 9,
      type: 'circle',
      style: 'green',
    }
  ]
}
