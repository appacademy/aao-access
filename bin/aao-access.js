#!/usr/bin/env node
const dashdash = require('dashdash');
const { signup } = require('../lib/signup');
const { readStudentFile } = require('../lib/students');

const options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'print help message'
    },
    {
        names: ['filename', 'f'],
        type: 'string',
        help: 'JSON filename containing array of students'
    },
    {
        names: ['taskid', 't'],
        type: 'string',
        help: 'Task ID of the week'
    }
]

const parser = dashdash.createParser({ options: options });
let opts;
try {
  opts = parser.parse(process.argv);
} catch (e) {
  console.error("aao-access: error: %s", e.message);
  process.exit(1);
}

if (opts.help) {
    help();
}

if (!opts.filename || !opts.taskid) {
  help();
}

function help() {
  const help = parser.help({ includeEnv: true }).trimRight();
  console.log("usage: aao-access [OPTIONS]\n" + "options:\n" + help);
  process.exit(0);
}

(async() =>{
  try {
    const students = await readStudentFile(opts.filename);
    if (!students) {
      console.log("No emails found");
    }
    await signup(opts.taskid, students);
  } 
  catch (e) {
    console.error(e);
  }
})();
