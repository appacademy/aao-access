const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });

module.exports = {
    BearerToken: process.env.BEARER_TOKEN,
    BaseURL: "https://api.appacademy.io/internal/v1/rest/eng-signup-production-bulkCourseSignup"
};