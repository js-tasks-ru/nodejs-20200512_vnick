const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':


      // Если есть вложенные папки - возвращаем ошибку 400
      if(pathname.includes('/')){
        res.statusCode = 400;
        res.end('Wrong path!');
        // console.log('Wrong path ///////////////')
        break;
      }

      fs.unlink(filepath, (err) => {
        if(err){
          if(err.code === 'ENOENT'){
            res.statusCode = 404;
            res.end('File did not exists!');
          }else{
            res.statusCode = 500;
            res.end('Something wrong...');
            // console.log('ERROR:',err);
          }
        }else{
          res.statusCode = 200;
          res.end('File deleted!');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
