const express = require('express');
const path = require('path');
const app = express();

const wwwroot = path.resolve(__dirname, '__mock__', 'wwwroot');

app.use(express.static(wwwroot));

app.get('*', function (_, response) {
  response.sendFile(path.resolve(wwwroot, 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`http-server listening on ${process.env.PORT}`);
});
