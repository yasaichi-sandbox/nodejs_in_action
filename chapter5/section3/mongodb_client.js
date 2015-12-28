// mongod --dbpath mongodb --port 27017でサーバー起動
const mongodb = require('mongodb');
const server = new mongodb.Server('127.0.0.1', 27017, {});
const client = new mongodb.Db('mydatabase', server, { w: 1 });

client.open((err) => {
  if (err) throw err;

  // コレクションにアクセスする（RDMS的に言えばテーブルにアクセス、かな）
  client.collection('test_collection', (err, collection) => {
    if (err) throw err;
    console.log('We are now able to perform queries.');

    collection.insert(
      {
        title: 'I like cake',
        body: 'It is quite good.'
      },
      { safe: true }, // callback実行前に操作を完了させたければtrue
      (err, documents) => {
        if (err) throw err;

        console.log(documents);
        console.log(`Document ID is: ${documents.ops[0]._id}`);
      }
    );

    collection.find({ title: 'I like cake' }).toArray(
      (err, results) => {
        if(err) throw err;

        console.log(results);
      }
    );
  });
});