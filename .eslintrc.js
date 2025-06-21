module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		mocha: true, // Add Mocha globals
		es2021: true // Enable modern JS features
	},
	globals: {
		ePub: true,
		JSZip: true
	},
	extends: "eslint:recommended",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2021 // Support async/await and modern syntax
	},
	rules: {
		indent: [
			"error",
			"tab",
			{ "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		quotes: [
			"warn",
			"double"
		],
		semi: [
			"error",
			"always"
		],
		"no-unused-vars" : ["warn"],
		"no-console" : ["warn"],
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"valid-jsdoc": ["warn"]
	}
};
