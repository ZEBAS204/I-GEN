/*
 * Copy static files to build directory
 */

const gulp = require('gulp')

// Path of files to move to ./build directory (relative)
const files = [
	'./src/static/**/*.*',
	'!./src/static/README.md', // exclude README.md
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
