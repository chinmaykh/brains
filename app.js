// (Application name) 
const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
const bodyParser = require('body-parser');

// Import Mongoose package
const mongoose = require('mongoose');
// Connect to Mongoose
var url = 'mongodb://localhost/' + '(localDBname)'

mongoose.connect(url, {
	useMongoClient: true
});

var conn = mongoose.connection;
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var fileupload = require("express-fileupload");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

app.use(express.static(__dirname + '/Front_end'));		//static public directory to be used
app.use(bodyParser.json()); // BOdy PArser initilization
app.use(fileupload());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(req.body);
	next();
});


// ObjectName = require('./models/NameOfFile)

conn.once('open', function () {
	var gfs = Grid(conn.db);


	// All set!


    //-----------------------------MAIL OPTIONS-------------------------------------------

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'chinmayharitas@gmail.com', // Username
			pass: 'Chin9kesh8' // pWord
		}
	});


	// FILE UPLOADS
	function cmon(req, res) {
		console.log(req.body.usrnam)
		var part = req.files.file;
		var writeStream = gfs.createWriteStream({
			filename: part.name,
			mode: 'w',
			content_type: part.mimetype,
			metadata: { // Optional use json format
			}
		});
		writeStream.on('close', function (response) {
			return res.status(200).send({
				message: 'Success',
				fileUploadId: response._id
			});
		});
		writeStream.write(part.data);
		writeStream.end();
	}

    // FILE DOWNLOAD GATEWAY
	function getFiles(req, res) {

		var readstream = gfs.createReadStream({
			_id: req
		});
		readstream.pipe(res);

	}

    // FILE QUERY PATHWAY

	function findFiles(req, res, pram) {

		// console.log("filename to download "+req.params);
		console.log(pram);
		gfs.files.find({ filename: pram }).toArray(function (err, files) {
			if (err) {
				return res.status(400).send(err);
			}
			else if (!files.length === 0) {
				return res.status(400).send({
					message: 'File not found'
				});
			}
			console.log(files);

			res.json(files);
		});


	}

    // FILE UPLOAD URL
	app.post('/upload', (req, res) => {
		req.files.file.name = req.body.class;
		console.log(req);
		cmon(req, res);
	});

    // FILE DOWNLOAD URL
	app.get('/files/:id', (req, res) => {
		console.log(req.params.id);
		getFiles(req.params.id, res);

	});

    // FILE QUERY URL
	app.post('/findMyFiles/', (req, res) => {
		var param = req.body.param;
		console.log(param);
		findFiles(req, res, param);
	});

	//----- Feedback -----
    
        // Enclose this in a proper route provider

		//  var mailOptions = {
		// 	from: 'svnpsrnr@gmail.com',
		// 	to: ['chinmayharitas@gmail.com'],
		// 	subject: 'Feedback !',
		// 	text: JSON.stringify(fbbbb)
	

		// transporter.sendMail(mailOptions, function (error, info) {

		// 	if (error) {
		// 		console.log(error);
		// 		console.log("Check for security permission from google");
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });

		
	//--------------------------------------------------Admin--------------------------------------------------------------------------------------

	// app.get('/list/Admins', (req, res) => {

	// 	Admin.getAdmins((err, creds) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		res.json(creds);
	// 	});
	// });

	var portnum   =  8000 ;// Your wish !!
	app.listen(portnum);
	console.log("The Server is running on port number " + portnum)
	});


