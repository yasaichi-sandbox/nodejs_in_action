const http = require('http');
const connect = require('connect');

// 素のhttpだと404を返してくれすらしない
http.createServer().listen(3001);

// connectではattachしたmiddlewareがレスポンスを返却しないと
// 404を返してくれるのでハッピー。
connect()
  .use(logger)
  .use(hello)     // use()が自分自身を返すのでチェーンで書ける
  .listen(3000);

// middlewareがただの関数なのサイコーや
function logger(req, _, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

// nextを取らないmiddlewareの形式はhttp.createServerに渡す
// コールバック関数と完全に一致 = httpを使っていたらすぐconnect用に
// 再利用できる！
function hello(_, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}