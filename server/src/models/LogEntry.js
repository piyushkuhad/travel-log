var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};

const requiredNumber = {
    type: Number,
    required: true
}

var logEntrySchema = new Schema({
  title:  requiredString,
  description: String,
  comments:   String,
  //comments: [{ body: String, date: Date }],
  image: String,
  rating: {
      type: Number, 
      min: 0,
      max: 5,
      default: 0
  },
  latitude: {
      ...requiredNumber,
      min: -90,
      max: 90
  },
  longitude: {
      ...requiredNumber,
      min: -180,
      max: 180
  },
  visitDate: {
      required: true,
      type: Date
  }
}, {
    timestamps: true
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema)

module.exports = LogEntry;