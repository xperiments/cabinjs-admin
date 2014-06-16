var fs = require('fs');
var http = require('http');
var path = require('path');


/*
 * hanson.js - Parser library for HanSON
 *
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * For details, see LICENSE or http://unlicense.org/
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * HanSON is JSON with comments, multiline strings and unquoted object property names.
 * - Comments use JavaScript syntax
 * - Multi-line strings use ES6's template quote syntax: ``.
 * - Object property names do not require quotes if they are valid JavaScript identifiers.
 * - Every JSON string is valid HanSON.
 * - HanSON can easily converted to real JSON.
 *
 *
 * hanson.js provides you with a HanSON object that has parse() and stringify() methods which
 * work like JSON's. Yu can use it as a CommonJS package dependency in Node.js:
 *
 *		var HanSON = require('hanson');
 *
 * If you invoke hanson.js and 'module' is not defined, it will write its reference into this.HanSON.
 *
 * Parsing a HanSON string is as easy as parsing a JSON string:
 * 		var obj = HanSON.parse(jsonSrc);
 *
 * Writing HanSON is also possible:
 * 		var h = HanSON.stringify(obj);
 *
 * Note that the current implementation of stringify() will write a JSON string without using any HanSON features.
 * This may change in future implementations.
 *
 * https://github.com/timjansen/hanson
 */

function extractLineFeeds(s) {
	return s.replace(/[^\n]+/g, '');
}

// input is the HanSON string to convert.
// if keepLineNumbers is set, toJSON() tried not to modify line numbers, so a JSON parser's
// line numbers in error messages will still make sense.
function toJSON(input, keepLineNumbers) {
	var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
	var ML_ESCAPE_MAP = {'\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"'};
	function unescapeQuotes(r) { return UNESCAPE_MAP[r] || r; }

	return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments
		function(s) {
			if (s.charAt(0) == '/')
				return keepLineNumbers ? extractLineFeeds(s) : '';
			else
				return s;
		})
		.replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, // pass 2: requote
		function(s, identifier, multilineQuote, singleQuote, lonelyComma) {
			if (lonelyComma)
				return '';
			else if (identifier != null)
				return '"' + identifier + '"';
			else if (multilineQuote != null)
				return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function(r) { return ML_ESCAPE_MAP[r]; }) +
					'"' + (keepLineNumbers ? extractLineFeeds(multilineQuote) : '');
			else if (singleQuote != null)
				return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
			else
				return s;
		});
}

var hanson = {
	toJSON: toJSON,
	parse: function(input) {
		return JSON.parse(toJSON(input, true));
	},
	stringify: function(obj) {
		return JSON.stringify(obj);
	}
};


// http://grammerjack.blogspot.com.es/2010/12/asynchronous-directory-tree-walk-in.html
// asynchronous tree walk
// root - root path
// fileCb - callback function (file, next) called for each file
// -- the callback must call next(falsey) to continue the iteration,
//    or next(truthy) to abort the iteration.
// doneCb - callback function (err) called when iteration is finished
// or an error occurs.
//
// example:
//
// forAllFiles('~/',
//     function (file, next) { sys.log(file); next(); },
//     function (err) { sys.log("done: " + err); });

function forAllFiles(root, fileCb, doneCb) {
	fs.readdir(root, function processDir(err, files) {
		if (err) {
			fileCb(err);
		} else {
			if (files.length > 0) {
				var file = root + '/' + files.shift();
				fs.stat(file, function processStat(err, stat) {
					if (err) {
						doneCb(err);
					} else {
						if (stat.isFile()) {
							fileCb(file, function(err) {
								if (err) {
									doneCb(err);
								} else {
									processDir(false, files);
								}
							});
						} else {
							forAllFiles(file, fileCb, function(err) {
								if (err) {
									doneCb(err);
								} else {
									processDir(false, files);
								}
							});
						}
					}
				});
			} else {
				doneCb(false);
			}
		}
	});
}

/*
	connect query variable helper
 */
function getQueryVariable(query, variable) {
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}


/*

 Parses markdown post and returns an object with
 all found properties defined in the post's head
 */
function getPostMeta( file, content  )
{

	var curlyNest = 1;
	var currentIndex = content.indexOf('{')+1;

	while (curlyNest !== 0 && content.substr(currentIndex).length > 0) {
		if (content.substr(currentIndex).indexOf('}') === -1 &&
			content.substr(currentIndex).indexOf('{') === -1) {
			return false;
		}
		if (content.substr(currentIndex).indexOf('}') !== -1) {
			if (content.substr(currentIndex).indexOf('{') !== -1) {
				if (content.substr(currentIndex).indexOf('}') < content.substr(currentIndex).indexOf('{')) {
					currentIndex += content.substr(currentIndex).indexOf('}') + 1;
					curlyNest--;
				} else {
					currentIndex += content.substr(currentIndex).indexOf('{') + 1;
					curlyNest++;
				}
			} else {
				currentIndex += content.substr(currentIndex).indexOf('}') + 1;
				curlyNest--;
			}
		} else {
			currentIndex += content.substr(currentIndex).indexOf('{') + 1;
			curlyNest++;
		}
	}


	var metadata = hanson.parse( content.substr( 0,currentIndex ) );
	var content = content.substr( currentIndex+1 );
	metadata['file'] = file;
	return metadata;
}


// retuns a recursively dir tree object
function dirTree( filename , replace ) {
	replace = replace || "";
	var stats = fs.lstatSync(filename),
		info = {
			path: filename.replace( replace,''),
			name: path.basename(filename)
		};

	if (stats.isDirectory()) {
		info.type = "folder";
		info.children = fs.readdirSync(filename)
			.filter(function(child){ return child!='.DS_Store'})
			.map(function(child) { return dirTree(filename + '/' + child, replace );
			});
	} else {
		// Assuming it's a file. In real life it could be a symlink or
		// something else!
		info.type = "file";
		info.ext = path.extname(info.name.toLowerCase());
	}
	return info;
}

/*
	Downloads an online resource and tries to determine the mimetype.
 */
var download = function(url, dest, res ) {

	var request = http.get(url, function(response) {


		var ext =".jpg"; // default to jpeg
		switch( response.headers['content-type'] )
		{
			case "image/jpeg":
				ext = ".jpg";
				break;
			case "image/png":
				ext = ".png";
				break;
			case "image/gif":
				ext = ".gif";
				break;
		}
		dest = dest + ext;
		var file = fs.createWriteStream(dest);
			file.on('finish', function() {
				file.close();  // close() is async, call cb after close completes.
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({downloadedImage: dest }));
			});

		response.pipe(file);

	}).on('error', function(err) { // Handle errors
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify( {error:'Something went wrong'} ) );
	});
};

/* 
	Uploads a post or image to the system
 */
function upload(req, res, next)
{

	var files=req.files.uploadFiles;
	var uploadDir = req.body.uploadDir;
	var cabinUploadDir = cabinDirectory+'/'+uploadDir;
	var type = req.body.type;

	files.forEach( function( file )
	{
		var uploadedFile = cabinUploadDir + file.name;
		fs.renameSync(file.path, uploadedFile );
		if( type == "image" )
		{
			fs.createReadStream(uploadedFile).pipe(fs.createWriteStream(uploadedFile.replace('./src','./dist')));
		}
	});
	res.setHeader('Content-Type', 'application/json');
	// response with basic file stats
	res.end
	(
		JSON.stringify
		({
			uploadedFiles: files.map
			(function (file)
				{
					return {
						'size': file.size,
						'path': (uploadDir + file.name).substr(1)
					}
				}
			)
		})
	);
}

/* LIST IMAGES */
function listImages(req, res, next)
{
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(  dirTree( cabinDirectory+'/src/images',cabinDirectory ), null, 4) );
}

/* LIST POSTS */
function listPosts(req, res, next)
{
	var postFiles = {};
	forAllFiles('./posts',
		function (file, next) {
			fs.readFile( file, 'utf8',function( err, content )
			{
				fs.stat(file, function( err, stats ){
					var ofile = file;
					file = path.basename(file);
					postFiles[file] = getPostMeta( ofile,content );
					next();
				});
			});

		},
		function (err) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(  err ? {"error":error}: postFiles ), null, 4 ); });
}

/* DELETE FILE */
function deleteFile(req, res, next)
{
	var file = req.body.file;
	fs.unlinkSync(file);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify( {deletedFile:file} ));
}

/* DOWNLOAD FILE */
function downloadFile(req, res, next)
{
	var srcImage = getQueryVariable(req.url.replace('/?',''),'src' ) ;
	var dstImage = getQueryVariable(req.url.replace('/?',''),'dst' ) ;
	download( srcImage, dstImage, res )
}

/* CONNECT MIDDLEWARE */
function middleware(connect, options) {

	var middlewares = [

		connect().use(connect.bodyParser({ uploadDir: __dirname+'/.tmp' })),
		connect().use("/admin", connect.static(__dirname + "/admin")),
		connect().use('/upload', upload),
		connect().use('/listImages', listImages),
		connect().use('/listPosts', listPosts ),
		connect().use('/delete', deleteFile),
		connect().use('/downloadFile', downloadFile)
	];

	var baseStaticDirs = [
		 cabinDirectory+'/dist'
		,cabinDirectory+'/src/images'
		,cabinDirectory+'/'
	];

	// add the static paths in options.base
	baseStaticDirs.forEach(function (base) {
		middlewares.push( connect.static( base ) );
	});

	return middlewares;
}
var cabinDirectory = "";
module.exports = function ( cabinGruntDir ){ cabinDirectory = cabinGruntDir; return middleware};