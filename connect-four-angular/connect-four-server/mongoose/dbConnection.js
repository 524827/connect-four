const mongoose = require('mongoose');
const config = require('./config');


class MongoDb {

  mongoUrl = `${config.mongodb_url}/${config.mongo_dbname}`;

  /**
   * @function connect -: function for connect mongoose
   */
   connect() {
    return mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true
    });
  }
}
module.exports = MongoDb;