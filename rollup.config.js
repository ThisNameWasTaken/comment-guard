import sass from 'rollup-plugin-sass';
import resolve from 'rollup-plugin-node-resolve';

export default [
  // Background
  {
    input: 'src/js/background.js',
    output: {
      file: 'build/background.js',
      format: 'iife',
    },
    plugins: [resolve()],
  },
  // Content Script
  {
    input: 'src/js/content.js',
    output: {
      file: 'build/content.js',
      format: 'iife',
    },
    plugins: [resolve()],
  },
  // Popup
  {
    input: 'src/js/popup.js',
    output: {
      file: 'build/popup.js',
      format: 'iife',
    },
    plugins: [resolve(), sass({ output: true })],
  },
];
