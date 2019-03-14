## aframe-canvas-text

A component renders text from generated canvas for [A-Frame](https://aframe.io).

### Properties

```html
<a-entity canvas-text="size:48; color:#0080FF; align:center; value:你好, HTML!\n\u270C\n你好, Aframe!"></a-entity>
```

| Property | Description                                               | Default Value |
| -------- | -----------                                               | ------------- |
| size     | Text size, 100 is about 1 meter in space.                 | 50            |
| color    | Text color.                                               | black         |
| value    | Text to be rendered, supports unicode text & newline(\n). | ''            |
| align    | Multi-line text alignment (left, center, right).          | 'left'        |