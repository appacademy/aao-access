const fetch = require("node-fetch");
const chalk = require("chalk");
const ctx = new chalk.Instance({ level: 2 });
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

const getFriendlyMessage = (message) => {
  if (!message) {
    return ctx.green('ok');
  }
  const friendlyMessages = {
    'no_new_courses': ctx.red('Already has access'),
    'Course name does not exist': ctx.red("Course doesn't exist")
  }

  return friendlyMessages[message] ? friendlyMessages[message] : ctx.green(message);
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
    const { results } = await response.json();
    for (let result of results) {
      if (result.success) {
        console.log(`${ctx.cyan(result.email)}: ${getFriendlyMessage(result.message)}`);
      } else {
        console.log(`${ctx.cyan(result.email)}: ${getFriendlyMessage(result.errorMessage)}`);
      }
    }
  } catch (e) {
    throw new Error(e);
  }
}

function getPostBody(course_id, emails = []) {
  return JSON.stringify({
    emails,
    course_id,
  });
}

module.exports = {
    signup
}