import { openDB } from 'idb';

export function initDB(storeName = "Products") {
  return openDB("Nozama", 2, {
    upgrade(db) {
      const store = db.createObjectStore(storeName, {
        keyPath: "id"
      });
      
      store.createIndex("id", "id");
      store.createIndex("category", "category");
    }
  });
}

export async function setRessources(data = [], storeName = "Products") {
  const db = await initDB(storeName);
  const tx = db.transaction(storeName, "readwrite");
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(storeName, "id");
}

export async function setRessource(data = {}, storeName = "Products") {
  const db = await initDB(storeName);
  const tx = db.transaction(storeName, "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(storeName, "id", data.id);
}


export async function getRessources(storeName = "Products") {
  const db = await initDB(storeName);
  return db.getAllFromIndex(storeName, "id");
}

export async function getRessource(id, storeName = "Products") {
  const db = await initDB(storeName);
  return db.getFromIndex(storeName, "id", id);
}

export async function unsetRessource(id, storeName = "Products") {
  const db = await initDB(storeName);
  await db.delete(storeName, id);
}