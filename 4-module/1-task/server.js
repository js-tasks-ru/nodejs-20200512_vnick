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
    res.end('There is any subfolders in this file storage.');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  // console.log('filepath:',filepath);

  switch (req.method) {
    case 'GET':

      fs.stat(filepath, (err,stats) => {
        if(err){
          res.statusCode = 404;
          res.end(`There is no file in: files/${pathname}`);
          return;
        }


        res.statusCode = 200;
        const readStream = new fs.ReadStream(filepath, { encoding: 'utf8' });
        readStream.on('data', (chunk) => {
          console.log('chunk:',chunk.length);
          res.write(chunk);
        });

        readStream.on('end', () => {
          res.end();
        })


        // fs.readFile(filepath, (err,content) => {
        //   if(err){
        //     res.statusCode = 500;
        //     res.end(`Server error: ${err}`);
        //     return;
        //   }
        //   res.end(content);
        //   return;
        // })
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
