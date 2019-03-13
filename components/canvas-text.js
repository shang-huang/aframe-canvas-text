if (typeof AFRAME === "undefined") {
  throw new Error("Canvas-text need AFRAME to work.");
}

AFRAME.registerComponent("canvas-text", {
  schema: {
    value: { type: "string" },
    size: { type: "int", default: 50 },
    color: { type: "color", default: "black" }
  },

  init: function () {
    // create canvas for texture, use parent uuid as id
    this.canvas = document.createElement("canvas");
    this.canvas.id = this.el.object3D.uuid;
    this.canvas.style.display = "none";
    this.el.appendChild(this.canvas);
    // create canvas context
    this.context = this.canvas.getContext("2d");
  },

  update: function (oldData) {
    if (oldData != this.data) {
      // get default font type & apply pixel ratio
      let _dpi = window.devicePixelRatio;
      let _fontType = window.getComputedStyle(document.body, null).getPropertyValue("font-family")
      let _font = this.data.size * _dpi + "px " + _fontType;
      // support unicode character
      let _uni_sentences = this.data.value.split("\\u");
      let _uni_sentence = "";
      for (var i = 1; i < _uni_sentences.length; i++) {
        let _unicode = _uni_sentences[i].substring(0, 4);
        let _sentence = String.fromCharCode(parseInt(_unicode, 16)) + _uni_sentences[i].substring(4, _uni_sentences[i].length);
        _uni_sentence += _sentence;
      }
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
      this.canvas.width = _width;
      this.canvas.height = _height;
      // clear previous text
      this.context.clearRect(0, 0, _width, _height);
      // fill text to canvas
      this.context.font = _font;
      this.context.textBaseline = "middle";
      this.context.fillStyle = this.data.color;
      let _lineCount = 0;
      let _fillHeight = 0;
      _sentences.forEach(sentence => {
        this.context.fillText(sentence, 0, (_lineHeights[_lineCount] / 2) + _fillHeight);
        _fillHeight += _lineHeights[_lineCount];
        _lineCount++;
      });
      // draw text
      let objRatio = 0.0075 / _dpi;
      this.el.setAttribute("geometry", { primitive: "plane", width: _width * objRatio, height: _height * objRatio });
      this.el.removeAttribute("material");
      this.el.setAttribute("material", { src: "#" + this.canvas.id.toString(), shader: "flat", npot: true, transparent: true });
    }
  },

  remove: function () {
    this.el.innerHTML = "";
  }
});