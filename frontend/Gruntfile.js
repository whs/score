module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			options: {
				compress: {hoist_vars: true},
				report: 'min'
			},
			shared: {
				files: {'shared.min.js': ['js/sha1.js', 'shared.js']}
			},
			desktop: {
				files: {'desktop.min.js': ['js/jquery.js', 'js/ui.js', 'js/highcharts.js', 'app.js']}
			},
		},
		cssmin: {
			total: {
				files: {
					'total.css': ['normalize.css', 'style.css']
				}
			}
		}
	});
	['grunt-contrib-uglify', 'grunt-contrib-cssmin'].forEach(function(v){
		grunt.loadNpmTasks(v);
	});
	grunt.registerTask('default', ['uglify', 'cssmin']);
}
