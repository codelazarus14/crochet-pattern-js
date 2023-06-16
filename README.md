# Design ideas
custom file format and syntax for creating and distributing crochet patterns in a condensed, portable plaintext format

can be parsed and displayed with more information - materials, progress, shorthand for yarns, stitches and other techniques

want something reasonably human-readable but also more specifically suited for parsing into data

## general requirements:
- `Title/Author/Description:` self-explanatory, also could add tags idk
- `Type:` - **only for future-proofing against anything but US crochet**
- `Materials:` (hooks, yarn, other)
  - `Hooks:` sizes/measurements interchangeable, ie: `US L` = `8mm`
  - `Yarn: X of Y` - `X` = # of `skeins` or `yards`, `Y` = name of yarn
  - `Other:` can specify other tools like scissors, markers, yarn needle
- `Glossary:`/specific techniques or combined stitches
  - common stitches used later in the pattern are autofilled from basic glossary i.e. don't have to write `sl = slip stitch` in every pattern
  - comma-sep. `<name>, <resulting stitch count>` calculated from stitches used in each row
- `Notes`, custom instructions
- **;-separated** pattern properties, just for my own sanity

optional: 
- Gauge?
- Size/Variations?

## the pattern (structure/syntax):
- `Section:` optional, break pattern into smaller pieces
- `Steps:` - newline-sep: enumerated list of steps, per section
  - entries contain an instruction for a single round/row i.e. `R1: ...`, or for multiple, i.e. `R1-15: ...`
  - entries can contain **references** to other steps before them i.e. `R4-10: Repeat `**`R2`**` 6 times...`
  - entries may specify an amount of stitches resulting from a row with the suffix `... (X st)`, otherwise **inferred** from the stitches used (if all stitches are standard/in glossary)
  - must have a **continuous** sequence of entries for 1-N rows
- images can be embedded Markdown-style (`['filepath'] Shawl after finishing R65`)
- steps can be referenced anywhere below their definition as `RX`, step # X

## syntax variations
- measurements specified by unit, `1 in` or `25 mm`, units constrained when necessary (can't have 2-inch hooks)
  - regional measuring differences aliased to underlying `mm`
- integers `0-9` aliased to `zero, one, two... nine`, values greater than 
- `increase X` or `decrease X` keywords aliased to `inc`/`dec X`. `X` defaults to 1 if unspecified
- all plaintext - should still display normally without using all the syntax rules (like Markdown!)

## Example:
```
Title: Example Pattern;
Author: Example Author;
Description: Example non-clickbait description;
Type: US Crochet;

Materials:
  Hooks: US L;
  Yarn: 3 skeins of A = Yarnspirations Bernat Blanket - Worsted Weight;

Glossary:
  dc2tog: double crochet two together, dec;
  bobble: bobble stitch, ...;

Notes:
  Simple and easy, beginner-friendly. You can add or remove rows to fit a different length. I also tried using a different weight for A, but this one turned out the best.

  Reminder: the beginning chain on each row doesn't count as a stitch!

  Follow me at @examplecrochet on all the platforms!;

Steps:
  R1: ch 22, dc in the 3rd chain from hook and each ch across (20 st);
  R2: ch 1, turn, sc in each st across;
  R3: ch 2, turn, 1 dc in the first 3 st, 5dc bobble in the 4th st, 1 dc in the next 11 stitches, 5dc bobble in the next st, 1 dc in the last 4 st;
  ...
```

## interface
dropdown at top conceals rest of page: "What type of project?"

select 'US Crochet' - page opens up below
text fields for title/author/desc

materials - dropdowns for hooks, field for yarn + amount

glossary - enter keyword/shorthand on left, description on right

notes - text field

steps labeled by Row
- each step requires an index (placeholder increments based on previous step), or range from `n-m`
- text field to the right contains instructions, parsed for references to previous steps and stitch names (styled with `<span>`?)
  - clicking on a reference brings you to the step w a temporary highlight, stitches can be moused over for tooltips pulled from glossary/general library
  - ie: `ch 1, turn, sc in each st across;` - mousing over `ch` brings up an entry for `Chain`, same for `sc`
