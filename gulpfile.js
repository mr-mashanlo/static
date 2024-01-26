import gulp from 'gulp';
import rollup from 'gulp-rollup';
import babel from 'rollup-plugin-babel';
import fileinclude from 'gulp-file-include';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'gulp-autoprefixer';
import groupMediaQueries from 'gulp-group-css-media-queries';
import csso from 'gulp-csso';
import webp from 'gulp-webp';
import ttf2woff2 from 'gulp-ttf2woff2';

import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import del from 'del';
import newer from 'gulp-newer';

const sass = gulpSass( dartSass );

const dir = process.argv.find( item => item.match( /--/gm ) ).slice( 2 );

const paths = {
  src: {
    base: `${dir}/src/`,
    html: `${dir}/src/*.html`,
    scripts: `${dir}/src/scripts/app.js`,
    styles: `${dir}/src/styles/**/*.sass`,
    images: `${dir}/src/images/**/*.{webp,svg,json,ico}`,
    compressImages: `${dir}/src/images/**/*.{png,jpg,jpeg}`,
    fonts: `${dir}/src/fonts/**/*.woff2`,
    compressFonts: `${dir}/src/fonts/**/*.ttf`,
  },
  dist: {
    base: `${dir}/dist/`,
    scripts: `${dir}/dist/scripts`,
    styles: `${dir}/dist/styles`,
    images: `${dir}/dist/images`,
    fonts: `${dir}/dist/fonts`
  }
};

function html() {
  return gulp.src( paths.src.html )
    .pipe( fileinclude() )
    .pipe( gulp.dest( paths.dist.base ) )
    .pipe( browserSync.stream() );
}

function styles() {
  return gulp.src( paths.src.styles )
    .pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
    .pipe( postcss( [ tailwindcss( `${paths.src.base}/tailwind.config.js` ) ] ) )
    .pipe( autoprefixer() )
    .pipe( groupMediaQueries() )
    .pipe( csso() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( paths.dist.styles ) )
    .pipe( browserSync.stream() );
}

function scripts() {
  return gulp.src( paths.src.scripts )
    .pipe( rollup( {
      input: paths.src.scripts,
      output: {
        file: paths.dist.scripts,
        format: 'iife',
        compact: true,
      },
      plugins: [
        babel( {
          exclude: 'node_modules/**',
          presets: [ '@babel/preset-env' ],
        } ),
      ],
    } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( paths.dist.scripts ) )
    .pipe( browserSync.stream() );
}

function compressImages() {
  return gulp.src( paths.src.compressImages )
    .pipe( newer( paths.dist.images ) )
    .pipe( webp( { quality: 95 } ) )
    .pipe( gulp.dest( paths.dist.images ) )
    .pipe( browserSync.stream() );
}

function copyImages() {
  return gulp.src( paths.src.images )
    .pipe( newer( paths.dist.images ) )
    .pipe( gulp.dest( paths.dist.images ) )
    .pipe( browserSync.stream() );
}

function compressFonts() {
  return gulp.src( paths.src.compressFonts )
    .pipe( newer( paths.dist.fonts ) )
    .pipe( ttf2woff2() )
    .pipe( gulp.dest( paths.dist.fonts ) )
    .pipe( browserSync.stream() );
}

function copyFonts() {
  return gulp.src( paths.src.fonts )
    .pipe( newer( paths.dist.fonts ) )
    .pipe( gulp.dest( paths.dist.fonts ) )
    .pipe( browserSync.stream() );
}

function clear() {
  return del( paths.dist.base );
}

function server() {
  browserSync.init( {
    server: { baseDir: paths.dist.base },
    notify: false,
    open: false,
  } );
}

function watcher() {
  gulp.watch( paths.src.html, gulp.parallel( html, styles ) );
  gulp.watch( paths.src.styles, styles );
  gulp.watch( paths.src.scripts, scripts );
  gulp.watch( paths.src.images, copyImages );
  gulp.watch( paths.src.compressImages, compressImages );
  gulp.watch( paths.src.fonts, copyFonts );
  gulp.watch( paths.src.compressFonts, compressFonts );
}

const dev = gulp.series( clear, gulp.parallel( html, styles, scripts, compressImages, copyImages, compressFonts, copyFonts ), gulp.parallel( server, watcher ) );
const build = gulp.series( clear, html, styles, scripts, compressImages, copyImages, compressFonts, copyFonts );

export { dev as default, build };