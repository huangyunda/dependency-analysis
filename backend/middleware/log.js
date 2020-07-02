async function log(ctx, next) {
  console.log(ctx.request.header.referer, new Date().toLocaleString());
  await next();
}

module.exports = log;
