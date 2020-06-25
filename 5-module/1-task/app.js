const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const { on } = require('process');
const router = new Router();

router.get('/subscribe', (ctx, next) => {
    return new Promise((resolve, reject) => {
        app.once('publish', (data) => {
            ctx.body = data.message;
            return resolve();
        });
    });
});

router.post('/publish', (ctx, next) => {
    if(Object.keys(ctx.request.body).length > 0){
        // console.log(`* body: ${JSON.stringify(ctx.request.body)} *`)
        app.emit('publish', ctx.request.body);
        ctx.response.body = JSON.stringify({ status: 'ok' });
    }else{
        // console.log('* empty request *');
        // ctx.response.body = JSON.stringify({ status: 'error' });
    }
});

app.use(router.routes());

module.exports = app;
