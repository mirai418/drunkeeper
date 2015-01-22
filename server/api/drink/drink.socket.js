/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var drink = require('./drink.model');

exports.register = function(socket) {
  drink.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  drink.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('drink:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('drink:remove', doc);
}