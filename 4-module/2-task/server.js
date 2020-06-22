const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const { Stream } = require('stream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      // console.log('req.headers:',req.headers);

      // Если есть вложенные папки - возвращаем ошибку 400
      if(pathname.includes('/')){
        res.statusCode = 400;
        res.end('Wrong path!');
        break;
      }

      // Если запрос пустой - вернем ошибку  500
      if(req.headers['content-length'] === '0'){
        res.statusCode = 409;
        res.end('Request is empty!');
        break;
      }

      // Если файл слишком большой
      if(req.headers['content-length'] > 1e6){
        res.statusCode = 413;
        res.end('File is more than 1Mb!');
        break;
      }

      const limStream = new LimitSizeStream({
        limit: 1e6
      });      

      const myStream = fs.createWriteStream(filepath, {flags: 'wx'});
      // req.pipe(myStream);
      req
        .pipe(limStream)
        .pipe(myStream);

      limStream.on('error', (err) => {
        // console.log(`[[[ ${err.code} ]]]`)
        if(err.code === 'LIMIT_EXCEEDED'){
          // console.log('- - - LIMIT_EXCEEDED - - -');
          res.statusCode = 413;
          res.end('File is too big! (LimitSizeStream class)');
          fs.unlink(filepath, (err) => {});
          return;
        }
        res.statusCode = 500;
        res.end('Something wrong...');
        fs.unlink(filepath, (err) => {});
      })

      myStream.on('error', (err) => {
        // console.log(`[[[ ${err.code} ]]]`)
        if(err.code === 'EEXIST'){
          res.statusCode = 409;
          res.end('File already exists!');
          return;
        }
        res.statusCode = 500;
        res.end('Something wrong...');
        fs.unlink(filepath, (err) => {});
      })

      myStream.on('close', () => {
        res.statusCode = 201;
        res.end('File created!');
        // console.log('myStream.on.close');
      })

      res.on('close', () => {
        // console.log('res.on.close');
        if(res.writableEnded) return;
        // console.log('Удаляю файл при обрыве соединения!');
        fs.unlink(filepath, (err) => {});
      });      

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
