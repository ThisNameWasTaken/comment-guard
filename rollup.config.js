import sass from 'rollup-plugin-sass';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [
	// Background
	{
		input: 'src/js/background.js',
		output: {
			file: 'build/background.js',
			format: 'iife',
		},
		plugins: [babel(), resolve()],
	},
	// Content Script
	{
		input: 'src/js/content.js',
		output: {
			file: 'build/content.js',
			format: 'iife',
		},
		plugins: [babel(), resolve()],
	},
	// Popup
	{
		input: 'src/js/popup.js',
		output: {
			file: 'build/popup.js',
			format: 'iife',
		},
		plugins: [babel(), resolve(), sass({ output: true })],
	},
];
