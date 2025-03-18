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

// MAIN //

/**
* ESLint rule to enforce one blank line between requires and example code in JSDoc.
*
* @param {Object} context - ESLint context
* @returns {Object} rule object
*/
function rule( context ) {
	/**
	* Reports the error message.
	*
	* @private
	* @param {ASTNode} node - node to report
	* @returns {void}
	*/
	function report( node ) {
		context.report({
			node: node,
			message: 'JSDoc @example blocks must have one blank line between require statements and code'
		});
	}

	/**
	* Analyzes JSDoc comments for empty lines between require statements and code.
	*
	* @private
	* @param {ASTNode} node - node containing JSDoc comment
	* @returns {void}
	*/
	function analyze( node ) {
		if ( !node.comments || !node.comments.length ) {
			return;
		}

		for ( let i = 0; i < node.comments.length; i++ ) {
			const comment = node.comments[ i ];
			if ( comment.type !== 'Block' || !comment.value.includes( '@example' ) ) {
				continue;
			}

			// Extract example blocks
			const exampleBlocks = comment.value.split( '@example' ).slice( 1 );
			
			for ( let j = 0; j < exampleBlocks.length; j++ ) {
				const block = exampleBlocks[ j ];
				const lines = block.split( '\n' ).map( line => line.trim() );
				
				let requireLineIndex = -1;
				for ( let k = 0; k < lines.length; k++ ) {
					if ( lines[ k ].includes( 'require(' ) ) {
						requireLineIndex = k;
						// Check if this is the last require statement
						let lastRequire = true;
						for ( let l = k + 1; l < lines.length; l++ ) {
							if ( lines[ l ].includes( 'require(' ) ) {
								lastRequire = false;
								break;
							}
							// If we find non-empty code line, stop checking
							if ( lines[ l ] && !lines[ l ].startsWith( '*' ) ) {
								break;
							}
						}
						
						if ( lastRequire ) {
							// Check if there's a blank line after the require
							let hasBlankLine = false;
							let nextNonEmptyFound = false;
							
							for ( let l = k + 1; l < lines.length; l++ ) {
								// Skip lines that are just asterisks
								if ( lines[ l ] === '*' || lines[ l ] === '* ' ) {
									continue;
								}
								
								// If we find a non-empty line
								if ( lines[ l ] && !lines[ l ].startsWith( '*' ) ) {
									// If we haven't seen a blank line, report error
									if ( !hasBlankLine && !nextNonEmptyFound ) {
										report( node );
									}
									nextNonEmptyFound = true;
									break;
								}
								
								// If it's an empty line (besides *)
								if ( !lines[ l ] || lines[ l ] === '*' || lines[ l ] === '* ' ) {
									hasBlankLine = true;
								}
							}
						}
					}
				}
			}
		}
	}

	return {
		'Program': analyze
	};
}

// EXPORTS //

module.exports = rule;
