const mongoose = require('mongoose');


const schema = mongoose.Schema;
/**
 * Schema for player and board 
 */
const boardSchema = new schema({
  "players": {
    type: Array,
  },

  "board": Array

})

module.exports.board = mongoose.model('board', boardSchema, 'board');