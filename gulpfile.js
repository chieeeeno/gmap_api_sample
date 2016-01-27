'use strict';

var browserSync = require("browser-sync");
var gulp = require('gulp');
var autoprefixer = require("gulp-autoprefixer");
var cache = require('gulp-cached');
var csscomb = require('gulp-csscomb');
var gulpIf = require('gulp-if');
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var minifyCss = require("gulp-minify-css");
var stripDebug = require('gulp-strip-debug')    //console.logを削除
var uglify = require("gulp-uglify");    //javascript minify
var minimist = require('minimist'); // CLI入力を解析
//var Notifier = require('node-notifier');
//var notifier = new Notifier();


/************************************
 * gulp.task(“タスク名”,function() {});でタスクの登録をおこないます。
 * gulp.src(“MiniMatchパターン”)で読み出したいファイルを指定します。
 * pipe(行いたい処理)でsrcで取得したファイルに処理を施します
 * gulp.dest(“出力先”)で出力先に処理を施したファイルを出力します。
 ************************************/

//“sass/style.scss” sass/style.scssだけヒット
//“sass/*.scss” sassディレクトリ直下にあるscssがヒット
// “sass/**/*.scss” sassディレクトリ以下にあるすべてのscssがヒット
// [“sass/**/.scss”,"!sass/sample/**/*.scss] sass/sample以下にあるscssを除くsassディレクトリ以下のscssがヒット


/************************************
 * settings
 ************************************/
var srcDir = "./";
var distDir = "./dest/";
var dir = srcDir;

var knownOptions = {
    string: 'mode',
    default: { mode: process.env.NODE_ENV || 'dev' } // NODE_ENVに指定がなければ開発モードをデフォルトにする
};
// コマンドラインの入力を解析
var options = minimist(process.argv.slice(2), knownOptions),
    prodmode = (options.mode === 'prod') ? true : false
dir  = prodmode ? distDir : srcDir;

console.log('[build mode]', options.mode, '[output in]', dir);


/************************************
 * Gulp Task Settings
 ************************************/

//var errorHandler = function(error) {
//    notifier.notify({
//        message: error.message,
//        title: error.plugin,
//        sound: 'Glass'
//    });
//};

//browser Sync
gulp.task("server", function() {
    browserSync({
        server: {
            //proxy: "local.abc",
            //index: 'list.html',
            //baseDir: dir + 'cipher.asahi.co.jp'
            //baseDir: dir + 'count.asahi.co.jp'
          baseDir: dir
        }
    });
});

//javascript minify
gulp.task("js", function() {
    gulp.src([srcDir + "/**/*.js", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        //.pipe(plumber({errorHandler: errorHandler}))
        .pipe(plumber())
        .pipe(cache('js'))
        .pipe(gulpIf(prodmode,stripDebug()))
        .pipe(gulpIf(prodmode,uglify()))
    //.pipe(uglify())
        .pipe(gulp.dest(dir))
        .pipe(browserSync.reload({stream:true}));
});


//sass compile
gulp.task("sass", function() {
    //var graph;
    gulp.src([srcDir + "/**/*.scss", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
    //.pipe(plumber({errorHandler: errorHandler}))
        .pipe(plumber())
        .pipe(cache('sass'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer("android 4.0"))
        .pipe(csscomb())
        //.pipe(minifyCss({advanced:false})) // minify
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dir))
        .pipe(browserSync.reload({stream:true}));
});


//html reload
gulp.task("html", function() {
    gulp.src([srcDir + "/**/*.html", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(plumber())
        //.pipe(gulp.dest(dir))
        .pipe(browserSync.reload({stream:true}));
});

//img reload
gulp.task("img", function() {
    gulp.src([srcDir + "/**/img/**/*", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
    //.pipe(plumber({errorHandler: errorHandler}))
        .pipe(plumber())
        //.pipe(gulp.dest(dir))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task("cacheFile", function() {
    gulp.src([srcDir + "/**/*.scss", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(plumber())
        .pipe(cache('sass'));
});


gulp.task("default", ['server','cacheFile'], function() {
    this.watching = true;
    //gulp.watch([srcDir + "/**/*.js", "!"+srcDir + "/**/min/**/*.js"], ["js"]);
    gulp.watch([srcDir + "/**/*.scss", "!"+srcDir + "/**/*.css"], ["sass"]);
    //gulp.watch([srcDir + "/**/*.scss", "!"+srcDir + "/**/*.css"], ["compass"]);
    gulp.watch(srcDir + "/**/*.html", ["html"]);
    gulp.watch(srcDir + "/**/img/**/*", ["img"]);
});

//gulp.task("build", ['js', 'sass', 'html', 'img']);




//gulp.task("sass", function() {
//    var graph;
//    //baseDir = "./source/";
//    graph = grapher.parseDir(srcDir);
//    gulp.src([srcDir + "/**/*.scss", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
//        .pipe(plumber())
//        .pipe(cache('sass'))
//        .pipe(gulpIf(this.watching, forEach(function(currentStream, file) {
//        var addParent, files;
//        files = [file.path];
//        addParent = function(childPath) {
//            return graph.visitAncestors(childPath, function(parent) {
//                if (!_.includes(files, parent)) {
//                    files.push(parent);
//                }
//                return addParent(parent);
//            });
//        };
//        addParent(file.path);
//        return gulp.src(files, {
//            base: srcDir
//        });
//    })))
//        .pipe(sass({
//        style : 'expanded'  //出力形式の種類　#nested, compact, compressed, expanded.
//    }))
//        .pipe(autoprefixer())
//        .pipe(gulp.dest(dir))
//    //.pipe(gulp.dest('./css'))
//        .pipe(browser.reload({stream:true}));
//    //console.log(dir);
//
//    gulp.src([srcDir + "/**/*.css", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
//        .pipe(gulp.dest(dir))
//        .pipe(browser.reload({stream:true}));
//});