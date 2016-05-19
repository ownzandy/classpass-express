var express = require('express');
var bodyParser  = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

var Schema = mongoose.Schema
var workoutSchema = new Schema({
	user: String,
	class: String,
	startDate: Date,
	endDate: Date,
	heartRateSamples: [{startDate: Date, endDate: Date, value: Number}],
	stepSamples: [{startDate: Date, endDate: Date, value: Number}],
	energySamples: [{startDate: Date, endDate: Date, value: Number}],
	distanceSamples: [{startDate: Date, endDate: Date, value: Number}],
})

var Workout = mongoose.model('Workout', workoutSchema)

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.post('/collect-data', function(req, res) {
    generateAndSaveWorkout(req.body)
    res.send(req.body)
});

function generateAndSaveWorkout(data) {
	var workout = new Workout({
		user: 'Andy',
		class: 'Running',
		startDate: new Date(data['startDate']*1000),
		endDate: new Date(data['endDate']*1000),
		heartRateSamples: mapSample(data['heartRate'], data['heartRateStart'], data['heartRateEnd']),
		stepSamples: mapSample(data['steps'], data['stepsStart'], data['stepsEnd']),
		energySamples: mapSample(data['energy'], data['energyStart'], data['energyEnd']),
		distanceSamples: mapSample(data['distance'], data['distanceStart'], data['distanceEnd'])
	})
	workout.save(function (err, fluffy) {
		if (err) return console.error(err);
  		console.log('saved successfully')
	});
}

function mapSample(samples, start, end) {
	var data = []
	for (var i = 0; i < samples.length; i++) { 
    	var json = ({
    		startDate: new Date(start[i]*1000),
    		endDate: new Date(end[i]*1000),
    		value: samples[i]
    	})
    	data.push(json)
	}
	return data
}

app.get('/', function (req, res) {
  var json = JSON.stringify({ 
    success: 'Hello World!'
  });
  res.send(json);
});
