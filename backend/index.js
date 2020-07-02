const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const log = require('./middleware/log');
const routes = require('./router');
const { wrapper } = require('./router/utils');

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(logger());
app.use(log);
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

routes.forEach(({ method, fn, path }) => router[method](path, wrapper(fn)));

const port = parseInt(process.argv[2]) || 2345;
app.listen(port, console.log(`app is listening at port:${port}`));
