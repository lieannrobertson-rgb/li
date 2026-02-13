import { INITIAL_FOOD, INITIAL_GROWTH, INITIAL_HEALTH, INITIAL_PROFILE } from './constants';
import { CatProfile, FoodItem, GrowthRecord, HealthState } from './types';

// Storage Keys
const KEYS = {
  PROFILE: 'cat_profile',
  GROWTH: 'cat_growth',
  FOOD: 'cat_food',
  HEALTH: 'cat_health',
};

// Generic Storage Helper
function getStorage<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    // Initialize if empty
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return initial;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
    alert('存储空间不足！请尝试删除一些照片。');
  }
}

// Specific Getters/Setters
export const storage = {
  getProfile: () => getStorage<CatProfile>(KEYS.PROFILE, INITIAL_PROFILE),
  setProfile: (data: CatProfile) => setStorage(KEYS.PROFILE, data),

  getGrowth: () => getStorage<GrowthRecord[]>(KEYS.GROWTH, INITIAL_GROWTH),
  setGrowth: (data: GrowthRecord[]) => setStorage(KEYS.GROWTH, data),

  getFood: () => getStorage<FoodItem[]>(KEYS.FOOD, INITIAL_FOOD),
  setFood: (data: FoodItem[]) => setStorage(KEYS.FOOD, data),

  getHealth: () => getStorage<HealthState>(KEYS.HEALTH, INITIAL_HEALTH),
  setHealth: (data: HealthState) => setStorage(KEYS.HEALTH, data),
};

// Image Compression
export const compressImage = (file: File, quality = 0.6, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Date Helpers
export const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '未知';
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0) {
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return `${diffDays}天`;
  }

  return `${years > 0 ? years + '岁' : ''}${months}个月`;
};

export const getDaysDiff = (dateStr: string): number => {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  // Reset time part for accurate day calculation
  target.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr || new Date());
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};