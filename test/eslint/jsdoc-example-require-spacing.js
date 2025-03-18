/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var RuleTester = require( 'eslint' ).RuleTester;
var rule = require( './../../etc/eslint/rules/jsdoc-example-require-spacing.js' );


// FIXTURES //

var valid = [
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'*',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' )
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* var baz = require( \'baz\' );',
			'*',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' )
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* // Comment about require',
			'*',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' )
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* // No require statements',
			'* var bar = 1 + 2;',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' )
	}
];

var invalid = [
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' ),
		errors: [
			{
				message: 'JSDoc @example blocks must have one blank line between require statements and code'
			}
		]
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* var baz = require( \'baz\' );',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' ),
		errors: [
			{
				message: 'JSDoc @example blocks must have one blank line between require statements and code'
			}
		]
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* // Comment about require',
			'* var bar = foo( 1, 2 );',
			'* // returns 3',
			'*/',
			'function foo() {}'
		].join( '\n' ),
		errors: [
			{
				message: 'JSDoc @example blocks must have one blank line between require statements and code'
			}
		]
	},
	{
		code: [
			'/**',
			'* Function description.',
			'*',
			'* @example',
			'* var foo = require( \'foo\' );',
			'* var bar = foo( 1, 2 );',
			'*',
			'* @example',
			'* var baz = require( \'baz\' );',
			'* var qux = baz( 3, 4 );',
			'*/',
			'function foo() {}'
		].join( '\n' ),
		errors: [
			{
				message: 'JSDoc @example blocks must have one blank line between require statements and code'
			},
			{
				message: 'JSDoc @example blocks must have one blank line between require statements and code'
			}
		]
	}
];


// TESTS //

var tester = new RuleTester({
	parserOptions: {
		ecmaVersion: 5,
		sourceType: 'script'
	}
});

tester.run( 'jsdoc-example-require-spacing', rule, {
	valid: valid,
	invalid: invalid
});
