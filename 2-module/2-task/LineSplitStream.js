const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._lastString = ''
  }

  _transform(chunk, encoding, callback) {

    const str = this._lastString + chunk.toString()
    const lines = str.split(os.EOL)

    this._lastString = lines.pop()
    for(let ch of lines){
      this.push(ch)
    }
    callback()
  }

  _flush(callback) {
    this.push(this._lastString)
    callback()
  }
}

module.exports = LineSplitStream;
