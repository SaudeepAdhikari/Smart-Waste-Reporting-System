const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function tryConn(label, buildOpts) {
  const m = await MongoMemoryServer.create();
  const uri = m.getUri();
  try {
    const conn = mongoose.createConnection(uri, await buildOpts(uri));
    await conn.asPromise();
    console.log(label, 'OK', conn.readyState);
    await conn.close();
  } catch (e) {
    console.error(label, 'ERR:', e.message);
  }
  await m.stop();
}

(async () => {
  await tryConn('empty-opts', async () => ({}));
  await tryConn('uri-opt', async (u) => ({ uri: u }));
  await tryConn('connectionFactory-opt', async (u) => ({ uri: u, connectionFactory: (c) => c }));
  await tryConn('onConnectionCreate-opt', async (u) => ({ uri: u, onConnectionCreate: (c) => { return c; } }));
  process.exit(0);
})();
