const request = require('./node_modules/request');
const fs = require('fs');
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding("utf8");
stdin.resume();
const http = process.argv[2];
const localPath = process.argv[3];
const writeFile = function(http, localPath) {
  request(http, (error, response, body) => {
    if (error) {
      console.log("URL is invalid!");
      process.exit();
    }
    fs.writeFile(localPath, body, err => {
      if (err) {
        console.log("File path is invalid!");
        process.exit();
      }
    });
  });
};

fs.access(localPath, fs.constants.F_OK, (error) => {
  if (error) {
    writeFile(http, localPath);
    setTimeout(() => {
      findSize(localPath);
    }, 1000);
    setTimeout(() => {
      process.exit();
    }, 3000);
  } else {
    console.log("File exists, press Y to overwrite");
    stdin.on('data', (key) => {
      key = key.toLowerCase();
      console.log(key);
      if (key === "y") {
        writeFile(http, localPath);
        setTimeout(() => {
          findSize(localPath);
        }, 1000);
        setTimeout(() => {
          process.exit();
        }, 3000);
        return;
    
      } else if (key !== "") {
        console.log("Bye!");
        process.exit();
        return;
      }
    });
  }
});

const findSize = function(localPath) {
  fs.stat(localPath, (error, stats) => {
    if (error) {
      console.log(error);
    }
    const fileSize = stats.size;
    setTimeout(() => {
      console.log("Downloaded and saved " + fileSize + " bytes to" + localPath);
      return fileSize;
    }, 1000);
  });
};

