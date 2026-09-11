const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const m = await MongoMemoryServer.create();
  const uri = m.getUri();
  console.log('URI', uri);
  try {
    const conn = mongoose.createConnection(uri, {});
    await conn.asPromise();
    console.log('CREATECONNECTION OK', conn.readyState);
    await conn.close();
    console.log('closed ok');
  } catch (e) {
    console.error('CREATECONN ERR:', e.message);
  }
  await m.stop();
})();
