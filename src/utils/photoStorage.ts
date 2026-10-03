/**
 * Helper to manage custom user photos in localStorage
 */

const STORAGE_KEY = 'our_universe_custom_photos';

export function getCustomPhotos(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomPhoto(memoryId: string, dataUrl: string): void {
  try {
    const photos = getCustomPhotos();
    photos[memoryId] = dataUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn("Could not save to localStorage (quota or disabled)", err);
  }
}

export function clearCustomPhotos(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
