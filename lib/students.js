const fs = require('fs').promises;

async function readStudentFile(filename) {
    try {
        const contents = await fs.readFile(filename, 'utf-8');
        return JSON.parse(contents);
    } catch (e) {
        throw new Error(`Couldn't read students from ${filename}: ${e.message}`);
    }
}

module.exports = {
    readStudentFile
};

