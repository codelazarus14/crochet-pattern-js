// TODO: storing patterns
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb

const PATTERNS_KEY = 'savedPatterns';
const PROGRESS_KEY = 'patternInProgress';

let savedPatterns;

/*
let db;

// create database request
const openRequest = window.indexedDB.open("pattern_db", 1);

// handle error opening db
openRequest.addEventListener('error', () => {
  console.error('Database failed to open.');
});

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully.');
  db = openRequest.result;

  // run code using db instance
});
*/

function loadPattern(key) {
  const saved = localStorage.getItem(PATTERNS_KEY);
  if (!saved || saved === 'undefined')
    console.error('No saved patterns found!');
  const patterns = JSON.parse(saved);
  return patterns[key];
  // look up key in pattern table
  // if found, return getItem(key)
}

function loadAllPatterns() {
  // return array of all saved patterns in table
  const saved = localStorage.getItem(PATTERNS_KEY);
  const patterns = saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  return patterns;
}

function savePattern(pattern, idx) {
  const saved = savedPatterns ? savedPatterns : [];
  if (idx) {
    saved[idx] = pattern;
  } else {
    saved.push(pattern);
  }
  localStorage.setItem(PATTERNS_KEY, 
    JSON.stringify(saved));
  // save pattern key to table
  // save pattern data with key
  return `key`;
}

function saveAllPatterns() {
  if (savedPatterns) {
    localStorage.setItem(PATTERNS_KEY, JSON.stringify(savedPatterns));
  }
}

function loadProgress() {
  const savedProgress = localStorage.getItem(PROGRESS_KEY);
  if (!savedProgress || savedProgress === 'undefined')
    console.error('No saved progress!');
  const progress = JSON.parse(savedProgress);
  return progress;
}

function saveProgress(patternProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(patternProgress));
}