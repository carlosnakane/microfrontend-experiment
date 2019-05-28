const path = require('path');
const fs = require('fs');


const appManifest = {
	"entrypoint": 'index.js'
};

fs.writeFile (path.resolve(__dirname, "./dist/app-manifest.json"), JSON.stringify(appManifest), function(err) {
    if (err) {
      throw err;
    }
    console.log('app-manifest.json written');
  }
);
