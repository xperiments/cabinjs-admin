CabinJS Admin
=============

Simple CabinJS Blog Admin.

## Installation

Open a terminal window, navigate to the CabinJS working directory an type:

	$ npm install cabinjs-admin
	
This will install the required "cabinjs-admin" module.

Edit the CabinJS Gruntfile.js and insert this line at top:

	var cabinjsAdmin = require('cabinjs-admin')(__dirname);
	
Locate the "connect" options and add the middleware key as:
	
	connect: {
	  dist: {
		options: {
		  port: 5455,
		  hostname: '0.0.0.0',
		  base: 'dist',
		  livereload: true,
		  middleware:cabinjsAdmin /* Add this line */
		}
	  }
	}

## Admin

Navigate to http://localhost:5455/admin


## Features

* Edit Title, Desciption, Date, Categories and Head Image
* Integrated markdown editor with preview and media manager.
* Small without dependencies
* Upload Images to the images folder
* Download online images using the "dropable" area.

## Todo

* Testing
* ~~Add option to save as draft~~
* ~~Confirm delete post~~
* Configurable post metadata ( add custom metadata & reflet it on the form )
* Manage files/folders inside the MediaBrowser 

