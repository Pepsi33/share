var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var fs = require('fs');

var css = '* { transition: all .1s; }';

var opts = {
    from: 'src/index.css',
    to: 'dist/index-opts.css',
    // 配置 map
    map: { inline: false }
};

fs.readFile('src/index.css', (err, css) => {
    postcss([autoprefixer, cssnano])
      .process(css, opts)
      .then(result => {
        console.log(result);
        fs.writeFile('index-opts.css', result.css, () => true)
        if ( result.map ) {
          fs.writeFile('index-opts.css.map', result.map, () => true)
        }
      })
  })
