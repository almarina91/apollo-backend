const fs = require('fs');

const log = async (e) => {
    const date = new Date;
    await fs.appendFileSync('apollo-log.txt',  `${date.toString()}, ${e.toString()} \n`)
}

module.exports = log;