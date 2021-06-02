/*
 * Copy static files to build directory
 */

const gulp = require('gulp')

const files = [
	// Path of files to move to ./build directory (relative)
	'./src/static/**/*.*',
]

// Destination where files will be copied
const filesDest = './build'

gulp.task('copy-static-files', () => gulp.src(files).pipe(gulp.dest(filesDest)))

gulp.task(
	'default',
	gulp.series('copy-static-files', (done) => {
		console.log('Copied files to build directory [END]')
		done()
	})
)
