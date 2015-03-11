/**
 * Broadcast updates to client when the mirai model changes
 */

'use strict';

var user = require('./user.model');

exports.register = function (socket) {
  user.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
};

function onSave (socket, doc, cb) {
  if (doc.runkeeperId === 31503880) {
    socket.emit('mirai:save', doc);
  }
  socket.emit('user' + String(doc.runkeeperId) + ':save', doc);
}
