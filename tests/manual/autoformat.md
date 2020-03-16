## Autoformat

1. Type `#` and press the space in an empty paragraph to replace it with a heading.

1. Type `*` or `-` and the press space in an empty paragraph to replace it with a list item.

1. Type `>` and press the space in an empty paragraph to replace it with a block quote.

1. Type a number from the range **1-3** followed by a `.` and press space to replace an empty paragraph with a numbered list item.

1. Type a number from the range **1-3** followed by a `)` and press space to replace an empty paragraph with a numbered list item.

1. Type `*foobar*`/`_foobar_` to italicize `foobar`. `*`/`_` should be removed.

1. Type `**foobar**`/`__foobar__` to bold `foobar`. `**`/`__` should be removed.

1. Type ``` `foobar` ``` to mark as code `foobar`. ```  ` ``` should be removed.

1. Type `~~foobar~~` to strikethrough `foobar`. `~~` should be removed.

1. Type `` ``` `` in a new line to create an empty code block. `` ``` `` should be removed.

1. For every autoformat pattern: Undo until you'll see just the pattern (e.g. `- `). Typing should be then possible without triggering the autoformatting again.

1. Typing a different pattern in an already converted block **must not** trigger the autoformatting. For example, typing `- ` in a heading should not convert a heading to a list.

1. Type inline formatting (bold, italic, code, strikethrough) after a soft break (<kbd>Shift</kbd>+<kbd>Enter</kbd>).
