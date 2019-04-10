# Limitations

- "Inlining the SVG provides more predictable results and control than if it is added with <use> or <img> because the SVG source is directly available in the DOM which is exposed to the accessibility API that is used by AT." - from https://css-tricks.com/accessible-svgs/

- Can't use for massive data, will become long to read and skip over
- Readable doesn't mean accessible

- Using <figure> is good as it's a sectioning root - it's children don't contribute to the outline of its ancestor

- Trying to use some new SVG attributes (such as tabindex) but lots of SVG2 is not yet implemented, even in accessibility-forward browsers like Firefox (https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_2_support_in_Mozilla)

- Arrows keys bit odd - not really a way to define arrow key navigation

- Table showing WCAG guidelines are met? Will probs be long so for the appendix

- Stuff about not working on Safari/MacOS initially
