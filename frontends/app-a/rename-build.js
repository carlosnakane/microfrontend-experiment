const fs = require('fs');
const path = require('path');
fs.rename(path.resolve(__dirname, 'build'), path.resolve(__dirname, 'dist'), () => {});