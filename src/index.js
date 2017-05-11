import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
const mongoose = require('mongoose');
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import passportStrategies from './auth/local';
import config from './config.json';
import util from 'util';

let app = express();
app.server = http.createServer(app);
console.log(config.databaseUrl);
mongoose.connect(config.databaseUrl);

// logger
app.use(morgan('dev'));

//configure passportStrategies
passportStrategies(passport);

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));
	app.use(passport.initialize());
	// app.use(passport.session());

	// api router
	app.use('/api', api({ config, db, passport }));

	console.log(util.inspect(passport, false, null));

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
