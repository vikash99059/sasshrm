export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`hrm_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`hrm_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage key ${key}:`, error);
  }
}
