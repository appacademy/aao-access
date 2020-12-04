const fetch = require("node-fetch");
const chalk = require("chalk");
const ctx = new chalk.Instance({ level: 2 });
const term = require("terminal-kit").terminal;
const {
  BaseURL, BearerToken
} = require('./config');

if (!BearerToken) {
  console.error("No Bearer Token provided, please add one to your .env file.");
  process.exit(1);
}

const FETCH_OPTIONS = {
  method: "POST",
  redirect: "follow",
  headers: {
    Authorization:
      `Bearer ${BearerToken}`,
    "Content-Type": "application/json",
  },
};

const getFriendlyMessage = r => {
  const message = r.success ? r.message : r.errorMessage;
  if (!message) {
    return 'ok';
  }
  const friendlyMessages = {
    'no_new_courses': 'Already has access',
    'Course name does not exist': "Course doesn't exist"
  }

  const friendlyMessage = friendlyMessages[message] ? friendlyMessages[message] : message;
  return r.success ? `^G${friendlyMessage}` : `^R${friendlyMessage}`;
}

function mergeResultsWithStudents(results, students) {
  return students.map((student) => {
    const result = results.find(r => r.email === student.email);
    return {
      ...student,
      ...result
    }
  });
}

async function signup(taskid, students = []) {
  try {
    const body = getPostBody(taskid, students);
    const response = await fetch(BaseURL, {
      ...FETCH_OPTIONS,
      body,
    });
    if (!response.ok) {
      throw new Error(ctx.red(`Couldn't signup ${taskid}`));
    }
    const { results: rawResults } = await response.json();
    const results = mergeResultsWithStudents(rawResults, students);
    const dataRows = results.map(r => {
      return [
        r.name,
        r.email,
        getFriendlyMessage(r)
      ]
    });
    table(dataRows);
  } catch (e) {
    throw new Error(e);
  }
}

function table(rowData) {
  term.table(
    [
      ["Name", "Email", "Status"],
      ...rowData
    ],
    {
      hasBorder: false,
      contentHasMarkup: true,
      textAttr: { color: "cyan" },
      firstRowTextAttr: { color: "yellow" },
      width: 120,
      fit: true, // Activate all expand/shrink + wordWrap
    }
  );
}

function getPostBody(course_id, students = []) {
  const emails = students.map(student => student.email);
  return JSON.stringify({
    emails,
    course_id,
  });
}

module.exports = {
    signup
}