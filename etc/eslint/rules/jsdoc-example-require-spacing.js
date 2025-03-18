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
	* Checks whether a JSDoc comment contains '@example' blocks with require statements 
	* that are not followed by a blank line before code.
	*
	* @private
	* @param {ASTNode} node - AST node to examine
	* @returns {void}
	*/
	function checkComment( node ) {
		// Look for block comments:
		if ( node.type !== 'Program' && (!node.comments || !node.comments.length) ) {
			return;
		}

		var sourceCode = context.getSourceCode();
		var comments = node.type === 'Program' ? sourceCode.getAllComments() : node.comments;
		
		for ( var i = 0; i < comments.length; i++ ) {
			var comment = comments[ i ];
			
			// Only process block comments (likely to be JSDoc):
			if ( comment.type !== 'Block' ) {
				continue;
			}
			
			var value = comment.value;
			
			// Check if the comment contains '@example':
			if ( value.indexOf( '@example' ) === -1 ) {
				continue;
			}
			
			// Extract each example block:
			var examples = value.split( '@example' );
			examples.shift(); // Remove the content before the first @example
			
			for ( var j = 0; j < examples.length; j++ ) {
				var example = examples[ j ];
				var lines = example.split( '\n' );
				
				var requireLineIndices = [];
				var codeLineIndices = [];
				
				// Find all require statement lines and code lines:
				for ( var k = 0; k < lines.length; k++ ) {
					var line = lines[ k ].trim();
					
					// Skip comment marker and extract actual content:
					if ( line.indexOf( '*' ) === 0 ) {
						line = line.substring( line.indexOf( '*' ) + 1 ).trim();
					}
					
					// Skip empty lines:
					if ( !line ) {
						continue;
					}
					
					// Check if it's a require statement:
					if ( line.indexOf( 'require(' ) !== -1 ) {
						requireLineIndices.push( k );
					}
					// If it's not a require statement and not a comment about require,
					// consider it a code line:
					else if ( 
						line.indexOf( '//' ) !== 0 || 
						(line.indexOf( '//' ) === 0 && line.indexOf( 'require' ) === -1) 
					) {
						codeLineIndices.push( k );
					}
				}
				
				// If we have both require and code lines:
				if ( requireLineIndices.length > 0 && codeLineIndices.length > 0 ) {
					var lastRequireLine = Math.max.apply( null, requireLineIndices );
					var firstCodeLine = Math.min.apply( null, codeLineIndices );
					
					// Code should come after require:
					if ( firstCodeLine > lastRequireLine ) {
						// Check if there's a blank line between:
						var hasBlankLine = false;
						
						for ( var m = lastRequireLine + 1; m < firstCodeLine; m++ ) {
							var line = lines[ m ].trim();
							// Check if it's a blank line (just * or empty):
							if ( line === '*' || line === '' || line === '* ' ) {
								hasBlankLine = true;
								break;
							}
						}
						
						// If there's no blank line, report an error:
						if ( !hasBlankLine ) {
							context.report({
								node: node,
								loc: comment.loc,
								message: 'JSDoc @example blocks must have one blank line between require statements and code'
							});
						}
					}
				}
			}
		}
	}

	return {
		'Program': checkComment,
		'FunctionDeclaration': checkComment,
		'FunctionExpression': checkComment,
		'ArrowFunctionExpression': checkComment,
		'VariableDeclaration': checkComment
	};
}

// EXPORTS //

module.exports = rule;
