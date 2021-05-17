require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
//const next = require('next');
const {default: createShopifyAuth} = require('@shopify/koa-shopify-auth');
const {verifyRequest} = require('@shopify/koa-shopify-auth');
const {default: Shopify, ApiVersion} = require('@shopify/shopify-api');
const Router = require('koa-router');
var serve = require('koa-static-server');

dotenv.config();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SHOPIFY_API_SCOPES.split(","),
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
//const app = next({dev: dev});
//const handle = app.getRequestHandler();

const ACTIVE_SHOPIFY_SHOPS = {};

//app.prepare().then(() => {
  const app = new Koa();
  const router = new Router();
  app.keys = [Shopify.Context.API_SECRET_KEY];

  app.use(
    createShopifyAuth({
      afterAuth(ctx) {
        const {shop, scope} = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        ctx.redirect(`/?shop=${shop}`);
      },
    }),
  );

  const handleRequest = async (ctx) => {
  //  await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("/", async (ctx, next) => {
    const shop = ctx.query.shop;

    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      //await handleRequest(ctx);
      next();
    }
  });

  app.use(serve({rootDir: 'webapp'}));

  // router.get("(/_next/static/.*)", handleRequest);
  // router.get("/_next/webpack-hmr", handleRequest);
  // router.get("(.*)", verifyRequest(), handleRequest);
  //router.get("(/*)", handleRequest);

  app.use(router.allowedMethods());
  app.use(router.routes());

  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
//});