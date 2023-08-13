export let selectedPattern;

export function setSelectedPattern(pattern) {
  selectedPattern = pattern;
}

// todo: refactor patterns to use nested objects
// instead of arrays ie: yarns as objects
export class Pattern {
  constructor(title, author, desc, type) {
    this.title = title;
    this.author = author;
    this.desc = desc;
    this.type = type;
  }
}

export const PatternTypes = {
  USCrochet: 'US Crochet'
};

export class CrochetPattern extends Pattern {
  constructor(title, author, desc) {
    super(title, author, desc, PatternTypes.USCrochet);
    this.hooks = [];
    this.yarns = [];
    // TODO: gauge?
    this.glossary = [];
    this.notes = '';
    // 2d array of steps ordered by sections,
    // each step consists of steps idx 1..n:
    // [startIdx, endIdx, instrs, errorFlag]
    this.steps = [[]];
  }
}

// unit: [displayname, # of mms]
// skeins obv an exception
export const Units = {
  mm: ["mm", 1],
  in: ["in", 25.4],
  feet: ["feet", 3048],
  yards: ["yards", 9144],
  meters: ["meters", 10000],
  skeins: ["skeins"]
}
export const unitNames =
  Object.values(Units).map((x) => x[0]);

// Crochet

export const USHookSizes = {
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

const yarnUnits = [Units.yards, Units.meters, Units.skeins];
export const yarnUnitNames = yarnUnits.map((x) => x[0]);