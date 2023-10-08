import { setSelectedPattern } from "../data/pattern-types.js";
import {
  deleteAllPatterns,
  deletePattern,
  saveSubmittedKey,
  savedPatterns
} from "../data/persistence.js";
import { addDeleteListeners } from "../utils/input.js";
import { renderListElement } from "../utils/output.js";

const patternListClearElement = document.querySelector('.js-clear-pattern-list');
const patternListElement = document.querySelector('.js-pattern-list');
const missingPatternAlert = document.querySelector('.js-pattern-alert');

export const renderPatternList = (loadAction) => {
  if (savedPatterns.length < 1) {
    missingPatternAlert.classList.remove('hidden');
  } else {
    missingPatternAlert.classList.add('hidden');
  }
  renderListElement(patternListElement, savedPatterns, generatePatternListItem);
  addPatternListListeners(loadAction);
}

function addPatternListListeners(loadAction) {
  patternListClearElement.addEventListener('click', () => {
    deleteAllPatterns();
    if (getLoadedPattern() !== null)
      location.reload();
    renderPatternList(loadAction);
  });

  document.querySelectorAll('.js-pattern-list-item')
    .forEach((pattern, idx) => {
      const loadButton = pattern.querySelector('.js-load-pattern');
      loadButton.addEventListener('click', () => {
        setLoadedPattern(idx, loadAction);
        renderPatternList(loadAction);
      });

      const previewButton = pattern.querySelector('.js-preview-pattern');
      previewButton.addEventListener('click', () => {
        saveSubmittedKey(idx);
        location.assign('./preview.html');
      });
    });

  addDeleteListeners(patternListElement, savedPatterns,
    (delIdx, deleted) => {
      const loaded = getLoadedPattern();

      if (delIdx === loaded) {
        delete patternListElement.dataset.loadedPattern;
        location.reload();
      }
      else if (delIdx < loaded)
        patternListElement.dataset.loadedPattern--;

      deletePattern(deleted);
      renderPatternList(loadAction);
    }, true);
}

export function setLoadedPattern(idx, loadAction) {
  patternListElement.dataset.loadedPattern = idx;
  // clone saved data so we dont reference it directly
  setSelectedPattern(structuredClone(savedPatterns[idx]));
  if (loadAction) loadAction(idx);
}

function getLoadedPattern() {
  const str = patternListElement.dataset.loadedPattern;
  return str === '' ? null : Number(str);
}

function generatePatternListItem(pattern, index) {
  const loaded = getLoadedPattern();
  const isLoaded = loaded === index ? 'loaded' : '';
  const first = index === 0 ? 'first' : '';

  return `<div class="pattern-list-item js-pattern-list-item ${isLoaded} ${first}" data-pattern-idx="${index}">
  <span class="pattern-title">${pattern.title}</span>
  <span class="pattern-author">${pattern.author}</span>
  <button class="preview-pattern js-preview-pattern">Preview</button>
  <button class="load-pattern js-load-pattern">Load</button>
  <button class="js-delete-button"></button></div>`;
}