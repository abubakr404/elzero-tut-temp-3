const { src, dest, watch, task } = require("gulp");
const concat = require("gulp-concat"),
  prefix = require("gulp-autoprefixer"),
  babel = require("gulp-babel"),
  sass = require("gulp-sass")(require("sass")),
  purge = require("gulp-css-purge"),
  pug = require("gulp-pug"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  livereload = require("gulp-livereload"),
  plumber = require("gulp-plumber"),
  replace = require("gulp-replace"),
  imagemin = require("gulp-imagemin"),
  zip = require("gulp-zip");
// ftp = require("vinyl-ftp");

const production = !false;

const paths = {
  allDistFiles: {
    src: "dist/**/*.*",
    dest: ".",
  },
  publicFiles: {
    src: "public/**/*.*",
    dest: "dist/",
  },
  image: {
    src: "src/assets/imgs/*.*",
    dest: "dist/assets/imgs/",
  },
  html: {
    src: "./index.pug",
    watchSrc: ["src/pug/**/*.pug", "./index.pug"],
    dest: "dist/",
    mainDest: "./",
  },
  css: {
    src: "src/assets/css/main.scss",
    dest: "dist/assets/css",
    watchSrc: "src/assets/css/**/*.scss",
    mainDest: "src/assets/css",
  },
  js: {
    src: "src/assets/js/**/*.js",
    dest: "dist/assets/js/",
  },
};

function html() {
  if (production) {
    return src(paths.html.src)
      .pipe(plumber())
      .pipe(pug())
      .pipe(concat("index.html"))
      .pipe(replace("public/", "./"))
      .pipe(replace("/src/assets/", "./assets/"))
      .pipe(dest(paths.html.dest))
      .pipe(plumber.stop())
      .pipe(notify("HTML production is done successfully!"))
      .pipe(livereload());
  } else {
    return src(paths.html.src)
      .pipe(plumber())
      .pipe(pug({ pretty: true }))
      .pipe(concat("index.html"))
      .pipe(dest(paths.html.mainDest))
      .pipe(plumber.stop())
      .pipe(notify("HTML is done successfully!"))
      .pipe(livereload());
  }
}

function css() {
  return (
    src(paths.css.src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefix("last 2 versions"))
      .pipe(concat("main.css"))
      .pipe(dest(paths.css.mainDest))
      .pipe(sass({ outputStyle: "compressed" }))
      // .pipe(purge())
      .pipe(prefix("last 2 versions"))
      .pipe(concat("main.css"))
      .pipe(sourcemaps.write("."))
      .pipe(plumber.stop())
      .pipe(dest(paths.css.dest))
      .pipe(notify("CSS is done successfully!"))
      .pipe(livereload())
  );
}

function js() {
  return src(paths.js.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(plumber.stop())
    .pipe(dest(paths.js.dest))
    .pipe(notify("javaScript is done successfully!"))
    .pipe(livereload());
}

function imageMin() {
  return src(paths.image.src)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(plumber.stop())
    .pipe(dest(paths.image.dest))
    .pipe(notify("image minify is done successfully!"))
    .pipe(livereload());
}

function publicFiles() {
  return src(paths.publicFiles.src)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(plumber.stop())
    .pipe(dest(paths.publicFiles.dest))
    .pipe(livereload());
}

function compressDist() {
  return src(paths.allDistFiles.src)
    .pipe(zip("gulp project.zip"))
    .pipe(dest(paths.allDistFiles.dest))
    .pipe(notify("all dist files are compressed successfully!"));
}

task("watchs", () => {
  require("./server.js");
  livereload.listen();
  watch(paths.css.watchSrc, css);
  watch(paths.html.watchSrc, html);
  watch(paths.js.src, js);
  watch(paths.image.src, imageMin);
  watch(paths.publicFiles.src, publicFiles);
});

task("compress", () => compressDist());
