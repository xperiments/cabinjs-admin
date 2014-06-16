

module.exports = function (grunt) {

	// load the task
	grunt.initConfig(
		{
			ts:
			{
				dev: {
					src: [
						"./ts/views/**/*.html.ts",
						"./ts/**/*.ts"
					],        // The source typescript files, http://gruntjs.com/configuring-tasks#files
					html: ["./ts/views/**/*.html"], // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
					reference: "./ts/reference.ts",  // If specified, generate this file that you can use for your reference management
					//watch: './ts',                     // If specified, watches this directory for changes, and re-runs the current target
					out:'./js/app.js',
					options: {                         // use to override the default options, http://gruntjs.com/configuring-tasks#options
						target: 'es3',                 // 'es3' (default) | 'es5'
						module: 'commonjs',            // 'amd' (default) | 'commonjs'
						sourceMap: false,               // true (default) | false
						declaration: false,            // true | false (default)
						removeComments: true,           // true (default) | false
						fast:"never"
					}
				}
			},
			watch: {
				typescript: {
					files: ['./ts/**/*.ts','./ts/views/**/*.html'],
					tasks: ['ts:dev']
				}
			}
		});



	require('load-grunt-tasks')(grunt);
	grunt.registerTask("default", ["ts:dev","watch"]);
	grunt.registerTask("compile", ["ts:dev"]);

}

