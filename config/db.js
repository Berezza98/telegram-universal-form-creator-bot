const LocalDB = require('../localDB');
const path = require('node:path');

module.exports = new LocalDB(path.resolve('./', 'texts', 'userTexts.json'));