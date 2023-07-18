const PATTERN_KEY = 'submittedPattern';

class Pattern {
  constructor(title, author, desc, type) {
    this.title = title;
    this.author = author;
    this.desc = desc;
    this.type = type;
  }
}

class CrochetPattern extends Pattern {
  constructor(title, author, desc) {
    super(title, author, desc, PatternTypes.USCrochet);
    this.hooks = [];
    this.yarns = [];
    this.glossary = [];
    this.notes = '';
    // 2d array of steps ordered by sections,
    // each step consists of:
    // [startIdx, endIdx, instrs, errorFlag]
    this.steps = [[]];
    this.sectionCounter = 0;
    this.rowCounter = 0;
  }
}

const PatternTypes = {
  USCrochet: 'US Crochet'
};

const Units = {
  mm: "mm",
  in: "in",
  feet: "feet",
  yards: "yards",
  meters: "meters",
  skeins: "skeins"
}

// Crochet

const USHookSizes = {
  B: 2.25,
  C: 2.75,
  D: 3.25,
  E: 3.50,
  F: 3.75,
  G: 4.00,
  H: 5.00,
  I: 5.50,
  J: 6.00,
  K: 6.50
}

const yarnUnits = [Units.meters, Units.yards, Units.skeins];