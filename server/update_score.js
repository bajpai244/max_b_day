/** @format */

const fs = require('fs');
const path = require('path');
const get_score = require('./get_score');

const file_path = path.resolve(process.cwd(), 'score.json');

module.exports = (current_score) => {
  if (current_score > get_score()) {
    fs.writeFileSync(file_path, `{"score":${current_score}}`);
  }
};
