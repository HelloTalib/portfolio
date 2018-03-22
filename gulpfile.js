const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const pump = require('pump');
const browserSync = require('browser-sync').create();
/*
    --TOP LEVEL FUNCTIONS--
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.dest - Points to folder to output
    gulp.watch  - Watch files and folders for changes
 */

// Compile Sass
gulp.task('sass', function() {
    gulp.src('sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css/'));
});

// Minify Css
gulp.task('minifyCss', function () {
    gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'));
});

// Minify Image
gulp.task('imgMin', function () {
    gulp.src(['img/*'])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('img/min/'));
});

gulp.task('jsMin', function() {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['sass', 'minifyCss', 'imgMin', 'jsMin']);

gulp.task('watch', function() {
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch([
       './css/*.css',
       '!./css/*.min.css'
    ], ['minifyCss']);
    gulp.watch(['img/*.jpg', 'img/*.png'], ['imgMin']);
    gulp.watch([
        './js/*.js',
        '!./js/*.min.js'
    ], ['jsMin']);
    gulp.watch('index.php', browserSync.reload);
});