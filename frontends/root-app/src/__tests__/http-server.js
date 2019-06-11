const express = require('express');
const path = require('path');
const port = process.env.TEST_PORT || 18060;
const app = express();

app.use(express.static(__dirname + '/__mock__/wwwroot'));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log("server started on port " + port);