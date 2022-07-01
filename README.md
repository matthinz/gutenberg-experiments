## Things to figure out

- Alert component
    - ~~Switch alert type~~
    - ~~Switch alert title heading level~~
    - Transform to paragraph
    - Transform from paragraph
    - transform from heading
    - Enter in heading does what?
    - Enter in text does what?
        - Use innerBlocks for text content?
- Process list component
    
- Block chooser / persistent "+" button
- Extend / modify columns component?
- Markdown? Can serialize as Markdown?

### How does "Type / to choose block" work?

This is an example of an **Autocompleter**. Wordpress also uses these for things like user @ mentions. This is wired up for `core/paragraph` blocks. To get it working, you need to call `setDefaultBlockName("core/paragraph")` (`registerCoreBlocks` [will do this for you](https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/index.js#L273)).

### Why does hitting "Enter" in a `core/heading` block create a new block?

When you hit Enter inside a `RichText` component from `@wordpress/block-editor`, it calls the function  `onSplit` prop. It actually calls the function twice, once for the text _before_ the cursor and once for the text _after_. Each call to `onSplit` can return a new block to replace the original (via function specified in the `onReplace` prop). So basically, `core/heading` handles Enter keypresses.

