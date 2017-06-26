var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Battle', new Schema({ 
	id: Number,
    name: String,
    operation: String,
    conflict: String,
    start: {year: Number, month: Number, day: Number},
    end: {year: Number, month: Number, day: Number},
    location: String,
    result: String,
    markers: [Schema.Types.Mixed],
    belligerents: [Schema.Types.Mixed],
    frontlines: [Schema.Types.Mixed]
}));
