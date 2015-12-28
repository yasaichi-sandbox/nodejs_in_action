const connect = require('connect');

function logger(req, _, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function restrict (req, _, next) {
  // next関数にerrを渡して呼び出すと、エラー処理のミドルウェアに処理が飛ぶ
  const authorization = req.headers.authorization;
  if(!authorization) return next(new Error('Unauthorized'));

  const parts = authorization.split(' ');
  const scheme = parts[0];
  if(scheme !== 'Basic') return next(new Error('Unauthorized'));

  const credentials = new Buffer(parts[1], 'base64').toString().split(':');
  const user = credentials[0];
  const password = credentials[1];

  authenticateWithDatabase(user, password, (err) => {
    if(err) return next(err);
    next();
  })
}

// ここではDB接続せず特定の値だけかどうかをチェックする
function authenticateWithDatabase(user, password, callback) {
  if(user === 'tobi' && password === 'ferret') return callback();
  callback(new Error('The user name or password is incorrect'));
}

function admin(req, res) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

function hello(_, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

connect()
  .use(logger)
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)
  .listen(3000);