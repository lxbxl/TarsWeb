const Koa = require('koa');
const app = new Koa();
const path = require('path');
const views = require('koa-views');
// const staticCache = require('koa-static-cache')
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const multer = require('koa-multer');

const {pageRouter, apiRouter, staticRouter} = require('./app/router');
const preMidware = require('./app/midware/preMidware');
const postMidware = require('./app/midware/postMidware');
const helmet = require("koa-helmet");
// const compress = require('koa-compress')
const loginMidware = require('./app/midware/loginMidware');


const upload = multer({dest: './uploads/'});

// error handler
onerror(app);

//安全防护
app.use(helmet());

//设置ejs模板
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

app.use(bodyparser());

app.use(upload.single('suse'));



//前置中间件
preMidware.forEach((midware)=>{
    app.use(midware);
});

//权限校验
app.use(loginMidware);

//激活router
app.use(pageRouter.routes(), pageRouter.allowedMethods());
app.use(apiRouter.routes(), apiRouter.allowedMethods());
app.use(staticRouter.routes(), staticRouter.allowedMethods());


//后置中间件
postMidware.forEach((midware)=>{
    app.use(midware);
});

module.exports = app;