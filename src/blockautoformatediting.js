/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module autoformat/blockautoformatediting
 */

import LiveRange from '@ckeditor/ckeditor5-engine/src/model/liverange';

/**
 * The block autoformatting engine. It allows to format various block patterns. For example,
 * it can be configured to turn a paragraph starting with `*` and followed by a space into a list item.
 *
 * The autoformatting operation is integrated with the undo manager,
 * so the autoformatting step can be undone if the user's intention was not to format the text.
 *
 * See the constructors documentation to learn how to create custom inline autoformatters. You can also use
 * the {@link module:autoformat/autoformat~Autoformat} feature which enables a set of default autoformatters
 * (lists, headings, bold and italic).
 */
export default class BlockAutoformatEditing {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'BlockAutoformatEditing';
	}

	/**
	 * Creates a listener triggered on `change` event in the document.
	 * Calls the callback when inserted text matches the regular expression or the command name
	 * if provided instead of the callback.
	 *
	 * Examples of usage:
	 *
	 * To convert a paragraph to heading 1 when `- ` is typed, using just the command name:
	 *
	 *		new BlockAutoformatEditing( editor, /^\- $/, 'heading1' );
	 *
	 * To convert a paragraph to heading 1 when `- ` is typed, using just the callback:
	 *
	 *		new BlockAutoformatEditing( editor, /^\- $/, ( context ) => {
	 *			const { match } = context;
	 *			const headingLevel = match[ 1 ].length;
	 *
	 *			editor.execute( 'heading', {
	 *				formatId: `heading${ headingLevel }`
	 *			} );
	 * 		} );
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {RegExp} pattern The regular expression to execute on just inserted text.
	 * @param {Function|String} callbackOrCommand The callback to execute or the command to run when the text is matched.
	 * In case of providing the callback, it receives the following parameter:
	 * * {Object} match RegExp.exec() result of matching the pattern to inserted text.
	 */
	constructor( editor, pattern, callbackOrCommand ) {
		let callback;
		let command = null;

		if ( typeof callbackOrCommand == 'function' ) {
			callback = callbackOrCommand;
		} else {
			// We assume that the actual command name was provided.
			command = editor.commands.get( callbackOrCommand );

			callback = () => {
				editor.execute( callbackOrCommand );
			};
		}

		editor.model.document.on( 'change', ( evt, batch ) => {
			if ( command && !command.isEnabled ) {
				return;
			}

			if ( batch.type == 'transparent' ) {
				return;
			}

			const changes = Array.from( editor.model.document.differ.getChanges() );
			const entry = changes[ 0 ];

			// Typing is represented by only a single change.
			if ( changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1 ) {
				return;
			}

			const blockToFormat = entry.position.parent;

			// Block formatting should trigger only if the entire content of a paragraph is a single text node... (see ckeditor5#5671).
			if ( !blockToFormat.is( 'paragraph' ) || blockToFormat.childCount !== 1 ) {
				return;
			}

			const match = pattern.exec( blockToFormat.getChild( 0 ).data );

			// ...and this text node's data match the pattern.
			if ( !match ) {
				return;
			}

			// Use enqueueChange to create new batch to separate typing batch from the auto-format changes.
			editor.model.enqueueChange( writer => {
				// Matched range.
				const start = writer.createPositionAt( blockToFormat, 0 );
				const end = writer.createPositionAt( blockToFormat, match[ 0 ].length );
				const range = new LiveRange( start, end );

				const wasChanged = callback( { match } );

				// Remove matched text.
				if ( wasChanged !== false ) {
					writer.remove( range );
				}

				range.detach();
			} );
		} );
	}
}
