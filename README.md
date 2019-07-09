## aframe-canvas-text

A component renders text from generated canvas for [A-Frame](https://aframe.io).

### Use with A-Frame Inspector
[![Use with A-Frame Inspector](https://img.youtube.com/vi/pJUQwnTbm_U/0.jpg)](https://www.youtube.com/watch?v=pJUQwnTbm_U)

### Usage

1. CDN - [jsDelivr](https://www.jsdelivr.com/package/npm/aframe-canvas-text)
2. Self-host - ```<script src="../components/canvas-text.min.js"></script> ```
3. Node.js - ```npm install aframe-canvas-text```

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
| side     | Side to render. (front, back, double).                    | 'front'       |
