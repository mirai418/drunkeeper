/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Runkeeper = require('./runkeeper.model');

exports.register = function(socket) {
  Runkeeper.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Runkeeper.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('runkeeper:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('runkeeper:remove', doc);
}