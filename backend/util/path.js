const path = require('path')

rootDir = path.dirname(require.main.filename).slice(0,-4);
module.exports = rootDir;