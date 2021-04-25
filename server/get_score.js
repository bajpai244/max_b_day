/** @format */

const fs = require('fs');
const path = require('path');

const { score } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'score.json'))
);

module.exports = () => score;
