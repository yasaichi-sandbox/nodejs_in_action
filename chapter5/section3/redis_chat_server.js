'use strict';

const net = require('net');
const redis = require('redis');

const server = net.createServer((socket) => {
  // ひとつのconnectionに対してpub/sub用のclientをそれぞれ生成する
  const subscriber = redis.createClient();
  const publisher = redis.createClient();

  subscriber.subscribe('main_chat_room');
  subscriber.on('message', (channel, message) => {
    socket.write(`Channel ${channel}: ${message}`);
  });

  // socketがreadable streamなので、これでユーザーからの入力が取れる
  socket.on('data', (data) => {
    publisher.publish('main_chat_room', data);
  });

  // ユーザーが接続を切断すると発行されるイベント
  socket.on('end', () => {
    subscriber.unsubscribe('main_chat_room');

    subscriber.end();
    publisher.end();
  });
});

server.listen(3000);