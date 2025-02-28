import { openDB, IDBPDatabase } from 'idb';

// Database name and version
const DB_NAME = 'techtrack-offline-db';
const DB_VERSION = 1;

// Define store names
const STORES = {
  TASKS: 'tasks',
  EQUIPMENT: 'equipment',
  PARTS: 'parts',
  REPORTS: 'reports',
  SYNC_QUEUE: 'sync-queue',
  USER_DATA: 'user-data',
};

// Initialize the database
async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
        taskStore.createIndex('city', 'city');
        taskStore.createIndex('status', 'status');
        taskStore.createIndex('priority', 'priority');
      }

      if (!db.objectStoreNames.contains(STORES.EQUIPMENT)) {
        const equipmentStore = db.createObjectStore(STORES.EQUIPMENT, { keyPath: 'id' });
        equipmentStore.createIndex('city', 'city');
        equipmentStore.createIndex('status', 'status');
        equipmentStore.createIndex('serial_number', 'serial_number', { unique: true });
      }

      if (!db.objectStoreNames.contains(STORES.PARTS)) {
        const partsStore = db.createObjectStore(STORES.PARTS, { keyPath: 'id' });
        partsStore.createIndex('status', 'status');
        partsStore.createIndex('equipment_type', 'equipment_type');
      }

      if (!db.objectStoreNames.contains(STORES.REPORTS)) {
        const reportsStore = db.createObjectStore(STORES.REPORTS, { keyPath: 'id' });
        reportsStore.createIndex('type', 'type');
        reportsStore.createIndex('created_at', 'created_at');
      }

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, {
          keyPath: 'id',
          autoIncrement: true
        });
      }

      if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
        db.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
      }
    },
  });
}

// Helper function to convert IDBValidKey to number
function convertKeyToNumber(key: IDBValidKey): number {
  return typeof key === 'number' ? key : Number(key);
}

// Generic CRUD operations
async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return db.getAll(storeName);
}

async function getById<T>(storeName: string, id: number): Promise<T | undefined> {
  const db = await initDB();
  return db.get(storeName, id);
}

async function add<T>(storeName: string, item: T): Promise<number> {
  const db = await initDB();
  const key = await db.add(storeName, item);
  return convertKeyToNumber(key);
}

async function put<T>(storeName: string, item: T): Promise<number> {
  const db = await initDB();
  const key = await db.put(storeName, item);
  return convertKeyToNumber(key);
}

async function remove(storeName: string, id: number): Promise<void> {
  const db = await initDB();
  return db.delete(storeName, id);
}

async function clear(storeName: string): Promise<void> {
  const db = await initDB();
  return db.clear(storeName);
}

// Sync queue operations
async function addToSyncQueue(operation: {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  storeName: string;
  data: any;
  url: string;
  method: string;
}): Promise<number> {
  const db = await initDB();
  const key = await db.add(STORES.SYNC_QUEUE, {
    ...operation,
    timestamp: new Date().toISOString(),
    synced: false,
  });
  return convertKeyToNumber(key);
}

async function getSyncQueue(): Promise<any[]> {
  const db = await initDB();
  return db.getAll(STORES.SYNC_QUEUE);
}

async function removeSyncQueueItem(id: number): Promise<void> {
  const db = await initDB();
  return db.delete(STORES.SYNC_QUEUE, id);
}

// User data operations
async function saveUserData(key: string, data: any): Promise<void> {
  const db = await initDB();
  await db.put(STORES.USER_DATA, { key, data });
}

async function getUserData(key: string): Promise<any> {
  const db = await initDB();
  const result = await db.get(STORES.USER_DATA, key);
  return result ? result.data : null;
}

// Export the storage service
const storageService = {
  // Store names
  STORES,

  // Tasks
  getTasks: () => getAll(STORES.TASKS),
  getTaskById: (id: number) => getById(STORES.TASKS, id),
  addTask: (task: any) => put(STORES.TASKS, task),
  updateTask: (task: any) => put(STORES.TASKS, task),
  deleteTask: (id: number) => remove(STORES.TASKS, id),

  // Equipment
  getEquipment: () => getAll(STORES.EQUIPMENT),
  getEquipmentById: (id: number) => getById(STORES.EQUIPMENT, id),
  addEquipment: (equipment: any) => put(STORES.EQUIPMENT, equipment),
  updateEquipment: (equipment: any) => put(STORES.EQUIPMENT, equipment),
  deleteEquipment: (id: number) => remove(STORES.EQUIPMENT, id),

  // Parts
  getParts: () => getAll(STORES.PARTS),
  getPartById: (id: number) => getById(STORES.PARTS, id),
  addPart: (part: any) => put(STORES.PARTS, part),
  updatePart: (part: any) => put(STORES.PARTS, part),
  deletePart: (id: number) => remove(STORES.PARTS, id),

  // Reports
  getReports: () => getAll(STORES.REPORTS),
  getReportById: (id: number) => getById(STORES.REPORTS, id),
  addReport: (report: any) => put(STORES.REPORTS, report),
  updateReport: (report: any) => put(STORES.REPORTS, report),
  deleteReport: (id: number) => remove(STORES.REPORTS, id),

  // Sync queue
  addToSyncQueue,
  getSyncQueue,
  removeSyncQueueItem,

  // User data
  saveUserData,
  getUserData,

  // Clear stores
  clearTasks: () => clear(STORES.TASKS),
  clearEquipment: () => clear(STORES.EQUIPMENT),
  clearParts: () => clear(STORES.PARTS),
  clearReports: () => clear(STORES.REPORTS),
  clearSyncQueue: () => clear(STORES.SYNC_QUEUE),
  clearUserData: () => clear(STORES.USER_DATA),

  // Clear all data
  clearAll: async () => {
    await clear(STORES.TASKS);
    await clear(STORES.EQUIPMENT);
    await clear(STORES.PARTS);
    await clear(STORES.REPORTS);
    await clear(STORES.SYNC_QUEUE);
    await clear(STORES.USER_DATA);
  },
};

export default storageService;