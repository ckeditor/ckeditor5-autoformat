/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import InlineAutoformatEngine from '../src/inlineautoformatengine';

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

import { setData, getData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';

testUtils.createSinonSandbox();

describe( 'InlineAutoformatEngine', () => {
	let editor, doc, batch;

	beforeEach( () => {
		return VirtualTestEditor.create( {
			plugins: [ Enter, Paragraph ]
		} )
		.then( newEditor => {
			editor = newEditor;
			doc = editor.document;
			batch = doc.batch();

			doc.schema.allow( { name: '$text', inside: '$block', attributes: [ 'myStyle' ] } );

			editor.commands.add( 'myStyle', new AttributeCommand( editor, 'myStyle' ) );
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'command', () => {
		it( 'should stop early if there are less than 3 capture groups', () => {
			new InlineAutoformatEngine( editor, /(\*)(.+?)\*/g, 'myStyle' ); // eslint-disable-line no-new

			setData( doc, '<paragraph>*foobar[]</paragraph>' );

			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), '*' );
			} );

			expect( getData( doc ) ).to.equal( '<paragraph>*foobar*[]</paragraph>' );
		} );

		it( 'should execute the command when the pattern is matched', () => {
			new InlineAutoformatEngine( editor, /(\*)(.+?)(\*)/g, 'myStyle' ); // eslint-disable-line no-new

			setData( doc, '<paragraph>x*foobar[]x</paragraph>' );

			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), '*' );
			} );

			expect( getData( doc ) ).to.equal( '<paragraph>x<$text myStyle="true">foobar</$text>[]x</paragraph>' );
		} );

		it( 'should force the command value when the pattern is matched', () => {
			new InlineAutoformatEngine( editor, /(\*)(.+?)(\*)/g, 'myStyle' ); // eslint-disable-line no-new

			setData( doc, '<paragraph><$text myStyle="true">foo*ba</$text>r[]</paragraph>' );

			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), '*' );
			} );

			expect( getData( doc ) ).to.equal( '<paragraph><$text myStyle="true">foobar</$text>[]</paragraph>' );
		} );

		it( 'should stop early if selection is not collapsed', () => {
			new InlineAutoformatEngine( editor, /(\*)(.+?)\*/g, 'myStyle' ); // eslint-disable-line no-new

			setData( doc, '<paragraph>*foob[ar]</paragraph>' );

			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), '*' );
			} );

			expect( getData( doc ) ).to.equal( '<paragraph>*foob*[ar]</paragraph>' );
		} );
	} );

	describe( 'callback', () => {
		it( 'should stop when there are no format ranges returned from testCallback', () => {
			const formatSpy = testUtils.sinon.spy();
			const testStub = testUtils.sinon.stub().returns( {
				format: [ [] ],
				remove: []
			} );

			new InlineAutoformatEngine( editor, testStub, formatSpy ); // eslint-disable-line no-new

			setData( doc, '<paragraph>*[]</paragraph>' );
			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), ' ' );
			} );

			sinon.assert.notCalled( formatSpy );
		} );

		it( 'should stop when there are no remove ranges returned from testCallback', () => {
			const formatSpy = testUtils.sinon.spy();
			const testStub = testUtils.sinon.stub().returns( {
				format: [],
				remove: [ [] ]
			} );

			new InlineAutoformatEngine( editor, testStub, formatSpy ); // eslint-disable-line no-new

			setData( doc, '<paragraph>*[]</paragraph>' );
			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), ' ' );
			} );

			sinon.assert.notCalled( formatSpy );
		} );

		it( 'should stop early when there is no text', () => {
			const formatSpy = testUtils.sinon.spy();
			const testStub = testUtils.sinon.stub().returns( {
				format: [],
				remove: [ [] ]
			} );

			new InlineAutoformatEngine( editor, testStub, formatSpy ); // eslint-disable-line no-new

			setData( doc, '<paragraph>[]</paragraph>' );
			doc.enqueueChanges( () => {
				batch.insert( doc.selection.getFirstPosition(), ' ' );
			} );

			sinon.assert.notCalled( formatSpy );
		} );
	} );
} );
