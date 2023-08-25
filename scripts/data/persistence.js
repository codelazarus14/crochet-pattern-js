import { PatternTypes } from "./pattern-types.js";

const dbKey = 'pattern_db';
const progressKey = 'inProgress';
const PatternOS = {
  USCrochet: 'uscrochet_os'
};

export let savedPatterns;
let db;

// database interfacing

export function setupDB() {
  return new Promise((resolve, reject) => {
    // create database request
    const openRequest = window.indexedDB.open(dbKey, 1);

    // handle error opening db
    openRequest.addEventListener('error', () => {
      console.error('Database failed to open.');
      reject();
    });

    openRequest.addEventListener('success', () => {
      console.log('Database opened successfully.');
      db = openRequest.result;
      resolve();
    });

    // todo: fix some kind of error that occurs on first time setup? something about 'can't start a transaction during an upgrade...'

    openRequest.addEventListener('upgradeneeded', (e) => {
      // Grab a reference to the opened database
      db = e.target.result;

      // Create an objectStore in our database to store notes and an auto-incrementing key
      // An objectStore is similar to a 'table' in a relational database
      const objectStore = db.createObjectStore(PatternOS.USCrochet, {
        keyPath: 'id',
        autoIncrement: true,
      });

      // Define what data items the objectStore will contain
      objectStore.createIndex('title', 'title', { unique: false });
      objectStore.createIndex('author', 'author', { unique: false });
      objectStore.createIndex('desc', 'desc', { unique: false });
      objectStore.createIndex('type', 'type', { unique: false });
      objectStore.createIndex('hooks', 'hooks', { unique: false });
      objectStore.createIndex('yarns', 'yarns', { unique: false });
      objectStore.createIndex('glossary', 'glossary', { unique: false });
      objectStore.createIndex('notes', 'notes', { unique: false });
      objectStore.createIndex('steps', 'steps', { unique: false });

      console.log('Database setup complete.');
    });
  });
}

// todo: refactor into general transaction-creation function
// to put various requests through
// and add more error-checking (resolve/reject)

function addData(os, pattern) {
  return new Promise((resolve, reject) => {
    // open a read/write db transaction, ready for adding the data
    const transaction = db.transaction([os], 'readwrite');

    // call an object store that's already been added to the database
    const objectStore = transaction.objectStore(os);

    // Make a request to add our newItem object to the object store
    const addRequest = objectStore.add(pattern);

    addRequest.addEventListener("success", () => {
      console.log('Adding item', pattern);
    });

    // Report on the success of the transaction completing, when everything is done
    transaction.addEventListener("complete", () => {
      console.log("Transaction completed: database modification finished.");
      resolve();
    });

    transaction.addEventListener("error", (e) => {
      console.log("Transaction not opened due to error", e.target.error);
      reject();
    });
  });
}

function setData(os, key, value, property) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([os], 'readwrite');
    const objectStore = transaction.objectStore(os);
    const getRequest = objectStore.get(key);

    getRequest.addEventListener('success', (e) => {
      let data = e.target.result;

      if (property) {
        switch (property) {
          case 'progress':
            data.progress = value.progress;
            break;
          default:
            console.error(`Invalid property ${property} for entry ${key} in ${os}`);
            reject();
        }
      } else {
        data = value;
      }

      const updateRequest = objectStore.put(data);

      updateRequest.addEventListener('success', () => {
        console.log(`Updating entry ${key} in ${os}`);
        resolve();
      });

      updateRequest.addEventListener('error', (e) => {
        reject(e);
      })
    });

    transaction.addEventListener("complete", () => {
      console.log("Transaction completed: database modification finished.");
      resolve();
    });

    transaction.addEventListener("error", (e) => {
      console.log("Transaction not opened due to error", e.target.error);
      reject();
    });
  });
}

function getData(os, key) {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction(os).objectStore(os);
    const getRequest = objectStore.get(key);

    getRequest.addEventListener('success', () => {
      resolve(getRequest.result);
    });
  });
}

function getAllData(os) {
  return new Promise((resolve, reject) => {
    const acc = [];
    const objectStore = db.transaction(os).objectStore(os);

    objectStore.openCursor()
      .addEventListener('success', (e) => {
        const cursor = e.target.result;
        // step through object store entries
        if (cursor) {
          acc.push(cursor.value);
          cursor.continue();
        } else {
          // end of os
          resolve(acc);
        }
      });
  });
}

function deleteData(os, key) {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction([os], 'readwrite').objectStore(os);
    const deleteRequest = objectStore.delete(key);

    deleteRequest.addEventListener('success', () => {
      console.log(`Deleted entry ${key} in ${os}`);
      resolve();
    });
  });
}

function deleteAllData(os) {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction([os], 'readwrite').objectStore(os);
    const clearRequest = objectStore.clear();

    clearRequest.addEventListener('success', () => {
      console.log(`Cleared object store ${os}`);
      resolve();
    });
  });
}

function typeToOS(type) {
  switch (type) {
    case PatternTypes.USCrochet:
      return PatternOS.USCrochet;
    default:
      console.error(`Type ${type} doesn't match any OS!`);
  }
}

// higher-level persistence functions

export async function loadPattern(type, key) {
  const os = typeToOS(type);
  return await getData(os, key);
}

export async function loadAllPatterns() {
  savedPatterns = [];
  const objectStores = db.objectStoreNames;

  for (let i = 0; i < objectStores.length; i++) {
    const os = objectStores.item(i);
    const osPatterns = await getAllData(os);
    savedPatterns = savedPatterns.concat(osPatterns);
  }
}

export async function submitPattern(pattern) {
  // in case we're submitting a new version of an existing pattern
  if (pattern.id) delete pattern.id;

  const os = typeToOS(pattern.type);
  await addData(os, pattern);
}

export async function savePattern(pattern) {
  const os = typeToOS(pattern.type);

  if (!pattern.id)
    await addData(os, pattern);
  else
    await setData(os, pattern.id, pattern);
}

export async function deletePattern(pattern) {
  const os = typeToOS(pattern.type);
  await deleteData(os, pattern.id);
}

export async function deleteAllPatterns() {
  savedPatterns = [];
  const objectStores = db.objectStoreNames;
  for (let i = 0; i < objectStores.length; i++) {
    const os = objectStores.item(i);
    await deleteAllData(os);
  }
}

export async function getInProgressKey() { 
  const inProgress = localStorage.getItem(progressKey);
  let patternKey = inProgress ? JSON.parse(inProgress) : 0;

  if (!savedPatterns.length) {
    throw new Error('No saved patterns!');
    return;
  }
  if (!savedPatterns[patternKey]) patternKey = 0;

  return patternKey;
}

export function saveInProgressKey(key) {
  if (key !== undefined)
    localStorage.setItem(progressKey, key);
}

// todo: bundle together all the set requests
// into one transaction to improve performance?
export async function savePatternProgress(patterns) {
  await patterns.forEach(async pattern => {
    const os = typeToOS(pattern.type);
    await setData(os, pattern.id, pattern, 'progress');
  });
}