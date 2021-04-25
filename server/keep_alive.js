/** @format */

var http = require('http');

http
  .createServer(function (req, res) {
    res.write('Yup! I just keep it all running (:');
    res.end();
  })
  .listen(8080);
