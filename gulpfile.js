/**
 * DEPENDENCIES
 */
// File System
const fs = require('fs-extra')
const path = require('path')
const del = require('del')

// Gulp
const gulp = require('gulp')
const through = require('through2')
const browserSync = require('browser-sync').create()

// YAML
const YAML = require('yaml')

// Markdown
const markdown = require('gulp-markdownit')
const markdownLink = require('markdown-it-link-attributes')

// Handlebars
const handlebars = require('gulp-hb')
const handlebarsHelpers = require('handlebars-helpers')

// HTML
const htmlmin = require('gulp-htmlmin')

// SCSS/CSS
const postcss = require('gulp-postcss')
const scss = require('gulp-sass')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// Images
const imagemin = require('gulp-imagemin')

/*
 * FUNCTIONS
 */
const data = {}

/**
 * Removes the output directory.
 */
const clean = () => del('out')

/**
 * Parses the metadata in the `src/info.yaml` into the `data` object.
 */
const info = done => {
  Object.assign(data, YAML.parse(fs.readFileSync('src/info.yaml').toString()))
  data.pages = {}
  fs.readdirSync('src/md')
    .map(basename => path.parse(basename).name)
    .filter(name => /^.+-[1-9][0-9]*$/.test(name))
    .sort((name1, name2) => {
      const [n1, n2] = [name1, name2].map(
        name => parseInt(name.split('-').pop())
      )
      return n1 - n2
    })
    .map(name => name.replace(/-[1-9][0-9]*$/, ''))
    .forEach((name, i) => {
      data.pages[name] = i === 0
        ? '/index.html'
        : `/page/${name}.html`
    })
  done()
}

/**
 * Outputs a `CNAME` file containing the website domain name for GitHub Pages.
 */
const cname = done => {
  fs.outputFileSync('out/CNAME', data.url.replace(/(^\w+:|^)\/\//, ''))
  done()
}

/**
 * Returns a stream of the markdown files in `src/md` with their content converted to HTML.
 */
const md = () => gulp
  .src('src/md/**/*.md')
  .pipe(markdown({
    options: {
      html: true,
      typographer: true
    },
    plugins: [
      {
        plugin: markdownLink,
        options: {
          pattern: /^https?:\/\//,
          attrs: {
            class: 'external-a',
            target: '_blank',
            rel: 'noopener'
          }
        }
      }
    ]
  }))

/**
 * Returns a stream of the markdown files in `src/md` with their content converted to HTML
 * and embedded in the layout defined by `src/layout.hbs`.
 */
const hb = () => {
  const layout = fs.readFileSync('src/layout.hbs')

  return md()
    .pipe(through.obj((file, enc, cb) => {
      file.stem = file.stem.replace(/-[1-9][0-9]*$/, '')
      file.data = Object.assign(
        {
          contents: file.contents.toString(),
          subtitle: file.stem
        },
        data
      )
      file.contents = layout
      if (data.pages[file.stem] === '/index.html') {
        file.stem = 'index'
      }
      cb(null, file)
    }))
    .pipe(handlebars().helpers(handlebarsHelpers))
}

/**
 * Outputs the markdown files in `src/md` with their content converted to HTML,
 * embedded in the layout defined by `src/layout.hbs`, and minified.
 */
const html = () => hb()
  .pipe(htmlmin({
    collapseWhitespace: true,
    collapseBooleanAttributes: true
  }))
  .pipe(gulp.dest(file => file.stem === 'index' ? 'out' : 'out/page'))
  .pipe(browserSync.reload({ stream: true }))

/**
 * Outputs the `src/style.scss` file converted to CSS, auto-prefixed, and minified.
 */
const css = () => gulp
  .src('src/style.scss')
  .pipe(scss())
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(gulp.dest('out'))
  .pipe(browserSync.reload({ stream: true }))

/**
 * Outputs the image files in `src/img` minified.
 */
const img = () => gulp
  .src('src/img/**/*.{gif,jpg,jpeg,png,svg}')
  .pipe(imagemin([
    imagemin.gifsicle(),
    imagemin.jpegtran(),
    imagemin.optipng(),
    imagemin.svgo({ plugins: [{ removeTitle: false }] })
  ]))
  .pipe(gulp.dest('out/img'))
  .pipe(browserSync.reload({ stream: true }))

/**
 * Outputs the files in `src/other`.
 */
const other = () => gulp
  .src('src/other/**/*')
  .pipe(gulp.dest('out/other'))
  .pipe(browserSync.reload({ stream: true }))

/**
 * TASKS
 */
gulp.task('clean', clean)

gulp.task('default', gulp.series(
  clean, info, gulp.parallel(cname, html, css, img, other)
))

gulp.task('browser', done => {
  browserSync.init({ server: { baseDir: 'out' } })
  done()
})

gulp.task('watch', gulp.series(
  'default',
  'browser',
  () => {
    gulp.watch(['src/info.yaml', 'src/md/**/*.md'], gulp.series(info, gulp.parallel(cname, html)))
    gulp.watch('src/layout.hbs', html)
    gulp.watch('src/layout/style.scss', css)
    gulp.watch('src/img/**/*.{gif,jpg,jpeg,png,svg}', img)
    gulp.watch('src/other/**/*', other)
  }
))
