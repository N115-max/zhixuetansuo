/* 智学探索 · 本地知识库存储层（IndexedDB，失败时退回 localStorage） */
const KnowledgeStore = (() => {
  const DB_NAME = 'zhixue_knowledge';
  const STORE = 'entries';
  const VERSION = 1;
  const LS_KEY = 'zhixue_learned_v1';

  let dbPromise = null;
  let useFallback = false;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        useFallback = true;
        resolve(null);
        return;
      }
      let req;
      try {
        req = indexedDB.open(DB_NAME, VERSION);
      } catch {
        useFallback = true;
        resolve(null);
        return;
      }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('subject', 'subject', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        useFallback = true;
        resolve(null);
      };
    });
    return dbPromise;
  }

  function readLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function writeLocal(list) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // 容量不足时丢弃最旧的记录
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(list.slice(-80)));
      } catch {
        // 放弃写入
      }
    }
  }

  async function getAll() {
    const db = await openDb();
    if (!db) return readLocal();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
        req.onerror = () => resolve(readLocal());
      } catch {
        resolve(readLocal());
      }
    });
  }

  async function put(entry) {
    const db = await openDb();
    if (!db) {
      const list = readLocal().filter((item) => item.id !== entry.id);
      list.push(entry);
      writeLocal(list);
      return true;
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(entry);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async function remove(id) {
    const db = await openDb();
    if (!db) {
      writeLocal(readLocal().filter((item) => item.id !== id));
      return true;
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async function putAll(entries) {
    const db = await openDb();
    if (!db) {
      const map = new Map(readLocal().map((item) => [item.id, item]));
      entries.forEach((item) => map.set(item.id, item));
      writeLocal([...map.values()]);
      return true;
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, 'readwrite');
        const store = tx.objectStore(STORE);
        entries.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  return { getAll, put, putAll, remove, isFallback: () => useFallback };
})();

if (typeof window !== 'undefined') {
  window.KnowledgeStore = KnowledgeStore;
}
