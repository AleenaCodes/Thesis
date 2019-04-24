# Limitations

- "Inlining the SVG provides more predictable results and control than if it is added with <use> or <img> because the SVG source is directly available in the DOM which is exposed to the accessibility API that is used by AT." - from https://css-tricks.com/accessible-svgs/

- Can't use for massive data, will become long to read and skip over
- Readable doesn't mean accessible

- Using <figure> is good as it's a sectioning root - it's children don't contribute to the outline of its ancestor

- Trying to use some new SVG attributes (such as tabindex) but lots of SVG2 is not yet implemented, even in accessibility-forward browsers like Firefox (https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_2_support_in_Mozilla)

- Arrows keys bit odd - not really a way to define arrow key navigation

- Table showing WCAG guidelines are met? Will probs be long so for the appendix

- Stuff about not working on Safari/MacOS initially

====== LAYOUT =====

1. Abstract - 1
2. Background - 10
3. Design - 4
4. Implementation - 3/5/1 = 9
5. Evaluation - 3/2/2 = 7
6. Conclusion - 2
7. Glossary - 2
8. Bibliograph - 2

Total = 33/37
