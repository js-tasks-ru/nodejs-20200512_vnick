const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  // console.log('pathname:',pathname)
  if(pathname.includes('/')){
    res.statusCode = 400;
    res.end('There i`~s any subfolders in this file storage.');
  }

  const filepath = path.join(__dirname, 'files', pathname);
  // console.log('filepath:',filepath);

  switch (req.method) {
    case 'GET':

      fs.stat(filepath, (err,stats) => {
        if(err){
          res.statusCode = 404;
          res.end(`There is no file in: files/${pathname}`)
        }
        res.statusCode = 200;
        fs.readFile(filepath, (err,content) => {
          if(err){
            res.statusCode = 500;
            res.end(`Server error: ${err}`)
          }
          res.end(content);
        })
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
