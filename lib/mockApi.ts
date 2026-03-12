import loads from "@/data/loads.json";

// Define the Load item interface for basic typing
export interface LoadItem {
  id: string;
  origin: string;
  destination: string;
  weight: string;
  status: string;
  createdAt: string;
}

// In-memory data store for the session to support edits/creates array changes
let memoryStore: LoadItem[] = [...loads];

export const getLoads = async (): Promise<LoadItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(memoryStore), 500);
  });
};

export const createLoad = async (newLoad: Omit<LoadItem, 'id' | 'createdAt'>): Promise<LoadItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const loadEntry: LoadItem = {
        id: "load_" + Date.now(),
        ...newLoad,
        createdAt: new Date().toISOString(),
      };
      
      memoryStore = [...memoryStore, loadEntry];
      resolve(loadEntry);
    }, 500);
  });
};

export const deleteLoad = async (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      memoryStore = memoryStore.filter(load => load.id !== id);
      resolve({ success: true });
    }, 500);
  });
};
