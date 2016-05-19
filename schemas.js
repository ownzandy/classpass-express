var mongoose = require('mongoose');
var Schema = mongoose.Schema
module.exports = {
	Workout: new Schema({
	user: String,
	class: String,
	startDate: Date,
	endDate: Date,
	heartRateSamples: [{startDate: Date, endDate: Date, value: Number}],
	stepSamples: [{startDate: Date, endDate: Date, value: Number}],
	energySamples: [{startDate: Date, endDate: Date, value: Number}],
	distanceSamples: [{startDate: Date, endDate: Date, value: Number}]
	})
}
