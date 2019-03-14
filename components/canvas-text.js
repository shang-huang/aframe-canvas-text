if (typeof AFRAME === "undefined") {
  throw new Error("Canvas-text need AFRAME to work.");
}

AFRAME.registerComponent("canvas-text", {
  schema: {
    value: { type: "string" },
    size: { type: "int", default: 50 },
    color: { type: "color", default: "black" },
    align: { type: "string", default: "left", oneOf: ["left", "center", "right"] }
  },

  init: function () {
    // create canvas for text texture, use object3D uuid as id
    this.canvas = document.createElement("canvas");
    this.canvas.id = this.el.object3D.uuid;
    this.canvas.style.display = "none";
    this.el.appendChild(this.canvas);
    // create canvas context
    this.context = this.canvas.getContext("2d");
  },

  update: function (oldData) {
    if (oldData != this.data) {
      let _el = this.el;
      let _canvas = this.canvas;
      let _context = this.context;
      // get default font type & apply pixel ratio
      let _dpi = window.devicePixelRatio;
      let _fontType = window.getComputedStyle(document.body, null).getPropertyValue("font-family")
      let _font = this.data.size * _dpi + "px " + _fontType;
      // support unicode character
      let _uni_sentences = this.data.value.split("\\u");
      let _uni_sentence = "";
      _uni_sentences.forEach((_sentence, index) => {
        if (index > 0) {
          let _unicode = _sentence.substring(0, 4);
          _uni_sentence += String.fromCharCode(parseInt(_unicode, 16)) + _sentence.substring(4, _uni_sentences[index].length);
        }
      });
      let _newline_sentence = _uni_sentences[0] + _uni_sentence;
      let _sentences = _newline_sentence.replace(/\\n/g, "\n").split("\n");
      // get text area size & height of each lines
      let _tempTextAreaEl = document.createElement("div");
      _tempTextAreaEl.style.display = "inline-block";
      _sentences.forEach(sentence => {
        let __tempTextEl = document.createElement("span");
        __tempTextEl.style.font = _font;
        __tempTextEl.innerText = sentence;
        _tempTextAreaEl.appendChild(__tempTextEl);
        let __tempBreakEl = document.createElement("br");
        __tempBreakEl.style.lineHeight = 0;
        _tempTextAreaEl.appendChild(__tempBreakEl);
      });
      document.body.appendChild(_tempTextAreaEl);
      let _width = _tempTextAreaEl.offsetWidth;
      let _height = _tempTextAreaEl.offsetHeight;
      let _lineHeights = [];
      _tempTextAreaEl.childNodes.forEach(child => {
        if (child.nodeName.toLowerCase() === "span") _lineHeights.push(child.offsetHeight);
      });
      document.body.removeChild(_tempTextAreaEl);
      // set canvas size
      _canvas.width = _width;
      _canvas.height = _height;
      // clear previous text
      _context.clearRect(0, 0, _width, _height);
      // fill text to canvas
      _context.font = _font;
      _context.textBaseline = "middle";
      _context.fillStyle = this.data.color;
      let _fillHeight = 0;
      _sentences.forEach((sentence, index) => {
        let _y = (_lineHeights[index] / 2) + _fillHeight;
        switch (this.data.align) {
          case "left":
            _context.textAlign = "left";
            _context.fillText(sentence, 0, _y);
            break;
          case "center":
            _context.textAlign = "center";
            _context.fillText(sentence, _width / 2, _y);
            break;
          case "right":
            _context.textAlign = "right";
            _context.fillText(sentence, _width, _y);
            break;
          default:
            _context.textAlign = "left";
            _context.fillText(sentence, 0, _y);
            break;
        }
        _fillHeight += _lineHeights[index];
      });
      // draw text
      let _objRatio = 0.0075 / _dpi;
      _el.setAttribute("geometry", { primitive: "plane", width: _width * _objRatio, height: _height * _objRatio });
      _el.removeAttribute("material");
      _el.setAttribute("material", { src: "#" + _canvas.id.toString(), shader: "flat", npot: true, transparent: true });
    }
  },

  remove: function () {
    this.el.innerHTML = "";
  }
});