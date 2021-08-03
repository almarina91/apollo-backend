const fs = require('fs');

/**
 * AAppends errors to the log file.
 * @const date - contains the date of the log info.
 */

const log = async (e) => {
    const date = new Date;
    await fs.appendFileSync('apollo-log.txt',  `${date.toString()}, ${e.toString()} \n`)
}

module.exports = log;