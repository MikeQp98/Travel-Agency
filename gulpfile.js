const { src, dest, watch, parallel } = require('gulp');
const gulp = require('gulp');
//css
const sass = require (`gulp-sass`)(require(`sass`));
const plumnber = require("gulp-plumber");
const autoprefixer = require ('autoprefixer');
const cssnano = require ('cssnano');
const postcss = require ('gulp-postcss');
const sourcemaps = require ('gulp-sourcemaps');

//imagenes
const cache = require ('gulp-cache');
const avif = require ('gulp-avif')
const webp = require ('gulp-webp');
const imagemin = require ('gulp-imagemin');

//Javascript
const terser = require ('gulp-terser-js');

//Html
const htmlmin = require('gulp-htmlmin');


function css (done) {
    src(`src/scss/**/*.scss`) //identificar el archivo .SCSS a compilar
    .pipe(sourcemaps.init())
    .pipe ( plumnber())
    .pipe( sass() ) //compilarlo
    .pipe (postcss ([autoprefixer(), cssnano () ]) ) //optimizacion al css 
    .pipe (sourcemaps.write('.')) 
    .pipe( dest (`build/css`) ) //Almacenarlo en el discp duro
   done();
 
}

function imagenes ( done ) {
   const opciones = {
      optimizationLevel: 3
   }
   src ('src/img/**/*.{png,jpg}')
   .pipe (cache ( imagemin (opciones) ) )
   .pipe (dest ('build/img') )
   done();
}

function versionWebp ( done ) {

   const opciones = {
      quality:50
   };

       src ('src/img/**/*.{png,jpg}')
      .pipe( webp (opciones) )
      .pipe (dest ('build/img') )

   done();
}

function versionavif ( done ) {

   const opciones = {
      quality:50
   };

       src ('src/img/**/*.{png,jpg}')
      .pipe( avif (opciones) )
      .pipe (dest ('build/img') )

   done();
}

function javascript( done ) {

   src('src/js/**/*.js')
   .pipe (sourcemaps.init ())
   .pipe ( terser () )
   .pipe (sourcemaps.write('.'))
   .pipe (dest ('build/js'));

   done();


}

function minify( done ) {
   src('./*.html')
   .pipe(htmlmin({ collapseWhitespace: true }))
   .pipe(dest('build'));

   done();
} 

function dev( done ) {

   watch("src/scss/**/*.scss", css);
   watch("src/js/**/*.js", javascript);
   watch("./*.html", minify);
   
   done();
   
}

exports.minify = minify;
exports.css = css;
exports.js = javascript;
exports.versionWebp = versionWebp;
exports.versionavif = versionavif;
exports.imagenes = imagenes;
exports.dev = parallel( javascript, dev, minify);
