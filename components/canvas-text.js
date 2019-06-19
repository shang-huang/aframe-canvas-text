AFRAME.registerComponent("canvas-text", {
  schema: {
    value: { type: "string" },
    size: { type: "int", default: 50 },
    color: { type: "color", default: "black" },
    align: { type: "string", default: "left", oneOf: ["left", "center", "right"] }
  },

  init() {
    this.canvas = createElement("canvas");
  },

  update(oldData) {
    (oldData != this.data) && draw(this.el, this.data, this.canvas);
  },
});

function draw(el, data, canvas) {
  // get default font type & apply pixel ratio
  const dpi = window.devicePixelRatio;
  const fontType = window.getComputedStyle(document.body, null).getPropertyValue("font-family");
  const font = `${data.size * dpi}px ${fontType}`;
  // support unicode character & line breaks 
  let sentences = unicodeSentnece(data.value).replace(/\\n/g, "\n").split("\n");
  // create text area
  let textAreaEl = createElement("div");
  textAreaEl.style.display = "inline-block";
  el.appendChild(textAreaEl);
  // get height of each lines
  let lineHeights = [];
  sentences.forEach(sentence => {
    // append sentence
    let textEl = createElement("span");
    textEl.style.font = font;
    textEl.innerText = sentence;
    textAreaEl.appendChild(textEl);
    lineHeights.push(textEl.offsetHeight);
    // append break for each line
    let breakEl = createElement("br");
    breakEl.style.lineHeight = 0;
    textAreaEl.appendChild(breakEl);
  });
  let width = textAreaEl.offsetWidth;
  let height = textAreaEl.offsetHeight;
  drawCanvas(canvas, width, height, font, data.color, data.align, sentences, lineHeights);
  drawEntity(el, canvas, width, height, dpi);
  el.removeChild(textAreaEl);
}

function unicodeSentnece(text) {
  let unicodeSentence = "";
  let unicodeSentences = text.split("\\u");
  unicodeSentences.forEach((sentence, index) => {
    if (index === 0) {
      unicodeSentence += sentence;
    } else {
      let unicodePlan1Plan2 = getUnicodeCharFromSentence(sentence, 5);
      if (/[\u{10000}-\u{2ffff}]/u.test(unicodePlan1Plan2)) {
        unicodeSentence += unicodePlan1Plan2 + sentence.substring(5, unicodeSentences[index].length);
      } else {
        let unicodePlan0 = getUnicodeCharFromSentence(sentence, 4);
        if (/[\u{0000}-\u{ffff}]/u.test(unicodePlan0)) {
          unicodeSentence += unicodePlan0 + sentence.substring(4, unicodeSentences[index].length);
        } else {
          unicodeSentence += sentence;
        }
      }
    }
  });
  return unicodeSentence;
}

function getUnicodeCharFromSentence(sentence, digits) {
  return String.fromCodePoint(parseInt(sentence.substring(0, digits), 16));
}

function createElement(tag) {
  return document.createElement(tag);
}

function drawCanvas(canvas, width, height, font, color, align, sentences, lineHeights) {
  let context = canvas.getContext("2d");
  // set canvas size
  canvas.width = width;
  canvas.height = height;
  // clear previous text
  context.clearRect(0, 0, width, height);
  // set text style
  context.font = font;
  context.textBaseline = "middle";
  context.fillStyle = color;
  // draw text line by line based on alignment
  let incrementHeight = 0;
  sentences.forEach((sentence, index) => {
    let y = (lineHeights[index] / 2) + incrementHeight;
    switch (align) {
      case "left":
        context.textAlign = "left";
        context.fillText(sentence, 0, y);
        break;
      case "center":
        context.textAlign = "center";
        context.fillText(sentence, width / 2, y);
        break;
      case "right":
        context.textAlign = "right";
        context.fillText(sentence, width, y);
        break;
    }
    incrementHeight += lineHeights[index];
  });
}

function drawEntity(el, canvas, width, height, dpi) {
  const ratio = 0.0075 / dpi;
  // claer previous object
  el.object3D.children.forEach(child => el.object3D.remove(child));
  // set canvas as NPOT texture
  // https://github.com/aframevr/aframe/blob/master/src/systems/material.js#L332
  let texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  // set material to flat shading, transparent & render to double sides
  let material = new THREE.MeshBasicMaterial({ map: texture });
  material.precision = "lowp";
  material.flatShading = true;
  material.transparent = true;
  material.side =  THREE.DoubleSide;
  let geometry = new THREE.PlaneGeometry(width * ratio, height * ratio, 1, 1);
  let mesh = new THREE.Mesh(geometry, material);
  el.object3D.add(mesh);
}