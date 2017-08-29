---
title: Autoformatting
category: features
---

{@snippet build-classic-source}

The {@link module:autoformat/autoformat~Auformat} feature allows you to quickly apply formatting to the content you are writing.

<info-box info>
	This feature is enabled by default in all builds. It is also included in the {@link module:presets/article~Article Article preset}.
</info-box>

## Block formatting

The following block formatting options are available:

* Bulleted list &ndash; Start a line with `*` or `-` followed by a space.
* Numbered list &ndash; Start a line with `1.` or `1)` followed by a space.
* Headings &ndash; Start a line with `#` or `##` or `###` followed by a space to create a heading 1, heading 2 or heading 3 (up to heading 6 if {@link module:heading/heading~HeadingConfig#options} defines more headings).
* Block quote &ndash; Start a line with `>` followed by a space.

## Inline formatting

The following inline formatting options are available:

* Bold &ndash; Type `**text**` or `__text__`.
* Italic &ndash; Type `*text*` or `_text_`.

## Autoformatting sample

Example:

1. Delete all editor content.
2. Press <kbd>#</kbd> and then <kbd>Space</kbd>.
3. The current line will be turned into a heading.

{@snippet examples/classic-editor}

## Installation

To add this feature to your editor install the [`@ckeditor/ckeditor5-autoformat`](https://www.npmjs.com/package/@ckeditor/ckeditor5-autoformat) package:

```
npm install --save @ckeditor/ckeditor5-autoformat
```

And add it to your plugin list:

```js
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';

ClassicEditor
	.create( {
		plugins: [ Autoformat, ... ]
	} )
	.then( ... )
	.catch( ... );
```

If you are using an editor build, see how to {@linkTODO customize builds}.

## Create custom autoformatters

The {@link module:autoformat/autoformat~Auformat} feature bases on {@link module:autoformat/blockautoformatengine~BlockAuformatEngine} and {@link module:autoformat/inlineautoformatengine~InlineAuformatEngine} tools to create the autoformatters mentioned above.

You can use these tools to create your own autoformatters. Check the [`Autoformat` feature's code](https://github.com/ckeditor/ckeditor5-autoformat/blob/master/src/autoformat.js) as an example.

## Contribute

The source code of the feature is available on GitHub in https://github.com/ckeditor/ckeditor5-autoformat.
