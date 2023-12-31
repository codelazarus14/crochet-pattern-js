export let selectedPattern;

export function setSelectedPattern(pattern) {
  selectedPattern = pattern;
}

// General data types

// unit: [displayname, # of mms]
// skeins obv an exception
export const Units = {
  mm: ["mm", 1],
  in: ["in", 25.4],
  feet: ["feet", 3048],
  yards: ["yards", 9144],
  meters: ["meters", 10000],
  skeins: ["skeins"]
};
export const unitNames =
  Object.values(Units).map((x) => x[0]);

const yarnUnits = [Units.yards, Units.meters, Units.skeins];
export const yarnUnitNames = yarnUnits.map((x) => x[0]);

//
// Patterns
//

export const PatternTypes = {
  USCrochet: 'US Crochet'
};

export class Pattern {
  constructor(title, author, desc, type) {
    this.title = title;
    this.author = author;
    this.desc = desc;
    this.type = type;
  }
}

// Crochet

const USHookSizes = {
  prefix: 'US',
  sizes: {
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
};

export class CrochetPattern extends Pattern {
  constructor(title, author, desc) {
    super(title, author, desc, PatternTypes.USCrochet);
    this.hooks = {
      type: USHookSizes,
      values: Object.keys(USHookSizes.sizes).map(() => false)
    };
    this.yarns = [];
    // TODO: gauge?
    this.glossary = [];
    this.notes = {
      text: ''
    };
    // 2d array of steps ordered by sections,
    // each section consists of steps idx 1..n
    // step = { start, end, instrs, errorFlag }
    this.steps = [[]];
  }
}