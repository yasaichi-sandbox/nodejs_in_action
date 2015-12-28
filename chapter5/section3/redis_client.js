'use strict';

const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

console.log(redis.print);

client.set('color', 'red', redis.print)

client.get('color', (err, value) => {
  console.log(value)
});

client.hmset('camping', {
  'sheler': '2-person tent',
  'cooking': 'campstove'
}, redis.print);

client.hget('camping', 'cooking', (err, value) => {
  console.log(value)
});

client.hkeys('camping', (err, value) => {
  console.log(value)
});

client.lpush('tasks', 'Paint the bikeshed red.' , redis.print);
client.lpush('tasks', 'Paint the bikeshed green.' , redis.print);

client.lrange('tasks', 0, -1, (err, value) => {
  console.log(value)
});

client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '72.32.231.8' , redis.print)

client.smembers('ip_addresses', (err, members) => {
  console.log(members);
});
