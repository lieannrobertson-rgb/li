export interface CatProfile {
  name: string;
  avatar: string; // Base64
  gender: 'boy' | 'girl';
  birthDate: string; // YYYY-MM-DD
  father?: string; // Human Dad (Optional)
  mother?: string; // Human Mom (Optional)
  zodiac: string;
  mbti: string;
  personality: string;
}

export interface GrowthRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string; // Base64
}

export interface FoodItem {
  id: string;
  brand: string;
  quantity: number; // weight in g or count
  type: 'staple' | 'snack';
  category?: string; // for snacks: can, freeze-dried, etc.
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number; // kg
}

export interface MedicalRecord {
  id: string;
  condition: string;
  medication: string;
  date: string;
  notes: string;
}

export interface HealthState {
  waterCheckIn: {
    lastDate: string; // YYYY-MM-DD
    done: boolean;
  };
  litter: {
    lastChanged: string; // YYYY-MM-DD
    cycleDays: number;
    type: string; // e.g. Tofu, Bentonite
  };
  vaccine: {
    lastDate: string; // YYYY-MM-DD
  };
  deworm: {
    lastDate: string; // YYYY-MM-DD
  };
  weightHistory: WeightRecord[];
  medicalHistory: MedicalRecord[];
}

export type TabType = 'profile' | 'growth' | 'food' | 'health';