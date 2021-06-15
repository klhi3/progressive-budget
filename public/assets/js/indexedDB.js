let db;
let databaseName = 'budget';
let storeName = "pending";
let txStoreName = ["pending"];
  
// Create a new db request for a "budget" database.
const req= indexedDB.open(databaseName, 1);

req.onupgradeneeded = function(e) {
  console.log("indexedDC: onupgradeneeded");
    // create object store called "BudgetStore" and set autoIncrement to true
  const db = e.target.result;
    // Creates an object store with a listID keypath that can be used to query on.
  db.createObjectStore(storeName, { keyPath: "_id", autoIncrement: true });
};
  
req.onerror = function(e) {
  console.log("There was an error ");
};
  
req.onsuccess = function(e) {
  console.log("indexedDC: req.onsuccess");
  db = e.target.result;
  if (navigator.online) checkDatabase();
};

// called index.js
function saveRecord(r) {
  console.log("indexedDC: saveRecord");
  const tx = db.transaction(txStoreName, "readwrite");
  const store = tx.objectStore(storeName);
  store.add(r);
};

function checkDatabase() {
  console.log("indexedDC: checkDatabased");
  const tx = db.transaction(txStoreName, "readwrite");
  const store = tx.objectStore(storeName);
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
          const tx = db.transaction(txStoreName,"readwrite");
          const store = tx.objectStore(storeName);

          let req = store.clear();
          req.onsuccess = function() {
            console.log("all objects transfered to backed db");
          }
        });
      };
    };
  };

  // listen for app coming back online
window.addEventListener('online', checkDatabase);