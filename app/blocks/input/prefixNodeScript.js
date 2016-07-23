const path = require('path')

const PrefixScript = require('./prefixScript')

class PrefixNodeScript extends PrefixScript {
  constructor (data) {
    super(data)
    try {
      const plugin = require(path.join(this.cwd, this.script))
      this.script = plugin(this.logger)
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  respondsTo (input) {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return false
    }
    return super.respondsTo(input)
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.logger.log('Executing Node Script', { query })
    return this.script(query, env).then((results) => {
      this.logger.log('Node Script Results', { results })
      return results
    }).catch((error) => {
      this.logger.error('Node Script failed', { query, error })
    })
  }
}

module.exports = PrefixNodeScript