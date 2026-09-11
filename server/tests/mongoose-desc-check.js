const mongoose = require('mongoose');
const proto = Object.getPrototypeOf(mongoose);
const inst = Object.getOwnPropertyDescriptor(mongoose, 'nextConnectionId');
const protoDesc = Object.getOwnPropertyDescriptor(proto, 'nextConnectionId');
console.log('instance desc:', inst);
console.log('proto desc:', protoDesc);
console.log('proto ctor name:', proto.constructor.name);
console.log('mongoose instanceof Mongoose?', mongoose instanceof require('mongoose').Mongoose);
console.log('mongoose.Mongoose === proto ctor?', mongoose.Mongoose === proto.constructor);
