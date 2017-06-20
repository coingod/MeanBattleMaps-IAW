var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Battle', new Schema({ 
	id: Number,
    name: String,
    operation: String,
    conflict: String,
    start: Date,
    end: Date,
    location: String,
    result: String,
    markers: [Schema.Types.Mixed],
    belligerents: [Schema.Types.Mixed],
    frontlines: [Schema.Types.Mixed]
}));
