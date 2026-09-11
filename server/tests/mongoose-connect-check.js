const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

(async () => {
  const m = await MongoMemoryServer.create();
  console.log('URI', m.getUri());
  try {
    await mongoose.connect(m.getUri());
    console.log('CONNECT OK readyState=', mongoose.connection.readyState);
    const M = mongoose.model('T', new mongoose.Schema({ a: String }));
    const doc = await M.create({ a: 'hello' });
    console.log('CREATE OK', doc._id.toString(), doc.a);
    await mongoose.disconnect();
    await m.stop();
    console.log('CLEAN OK');
  } catch (e) {
    console.error('CONNECT ERR', e.message);
    process.exit(1);
  }
})();
