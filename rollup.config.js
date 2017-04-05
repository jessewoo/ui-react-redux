import buble from 'rollup-plugin-buble';

var path = require('path');
var pkg = require('./package.json');
var external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/ngl-ui.js',
  plugins: [
    buble({ jsx: 'h'  })
  ],
  external: external,
  targets: [
    {
      dest: "build/js/ngl-ui.dev.js",
      format: 'umd',
      moduleName: 'NGLUI',
      globals: { redux: "Redux", preact: "preact", ngl: "NGL" },
      sourceMap: true
    }
  ]
};