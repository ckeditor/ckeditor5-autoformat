/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals console, window, document */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Autoformat from '../../src/autoformat';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import List from '@ckeditor/ckeditor5-list/src/list';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Typing from '@ckeditor/ckeditor5-typing/src/typing';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Undo from '@ckeditor/ckeditor5-undo/src/undo';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class TextTransform extends Plugin {
	init() {
		const editor = this.editor;

		editor.model.document.on( 'change', ( evt, batch ) => {
			if ( batch.type == 'transparent' ) {
				return;
			}

			const selection = editor.model.document.selection;

			// Do nothing if selection is not collapsed.
			if ( !selection.isCollapsed ) {
				return;
			}

			const changes = Array.from( editor.model.document.differ.getChanges() );
			const entry = changes[ 0 ];

			// Typing is represented by only a single change.
			if ( changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1 ) {
				return;
			}

			const block = selection.focus.parent;
			const text = getText( block ).slice( 0, selection.focus.offset );

			console.log( text );

			const configured = new Map( Object.entries( editor.config.get( 'textTransform.transformations' ) ) );

			text.endsWith( 'abc' );

			const found = Array.from( configured.keys() ).find( key => {
				const b = text.endsWith( key );
				console.log( text, key, b );
				return b;
			} );

			console.log( found );

			if ( found ) {
				editor.model.enqueueChange( writer => {
					const changeTo = configured.get( found );

					const start = writer.createPositionAt( block, selection.focus.offset - found.length );
					const end = writer.createPositionAt( block, selection.focus.offset );
					const range = writer.createRange( start, end );

					editor.model.insertContent( writer.createText( changeTo ), range );
				} );
			}
		} );
	}
}

function getText( element ) {
	return Array.from( element.getChildren() ).reduce( ( a, b ) => a + b.data, '' );
}

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ Enter, Typing, Paragraph, Undo, Bold, Italic, Code, Heading, List, Autoformat, BlockQuote, TextTransform ],
		toolbar: [ 'heading', '|', 'numberedList', 'bulletedList', 'blockQuote', 'bold', 'italic', 'code', 'undo', 'redo' ],
		textTransform: {
			transformations: {
				// Might be at the end of a word or
				'!tm': '™',
				'!NYC': 'New York City',

				// Provide alternatives - some optimization might be required:
				':)': '🙂',
				':smile:': '🙂',

				// Order matters as some transformations might contain others:
				// This has to be first...
				'--- ': '— ',
				// ...and this second as one is contained in another.
				'-- ': '– '
			}
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
